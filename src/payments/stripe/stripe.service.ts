import { product } from "./../../drizzle/schema/product.schema";
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import Stripe from "stripe";
import { OrderValuesType, ProductValuesType } from "./types/stripe-types";
import { absoluteUrl } from "../lib/absolute-url";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import { subscription } from "src/drizzle/schema/subscription.schema";
import { eq, inArray } from "drizzle-orm";

import { user as userSchema } from "../../drizzle/schema/user.schema";
import { orderDetailSchema } from "src/drizzle/schema/order-detail.schema";
import { usersOrders } from "src/drizzle/schema/users-orders.schema";
import { orderProducts } from "src/drizzle/schema/order-products";

interface Metadata {
  user: string;
  products: string;
  address: string;
  phone: string;
  method: string;
  paymentMethod: string;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }

  private async customerOrdered(
    paymentIntendId: string,
    metadata: Stripe.Metadata,
    amount: number
  ) {
    const { user, products, address, phone, method, paymentMethod } = metadata;

    console.log({ paymentIntendId, metadata, amount });

    const userId = Number(user);

    console.log(JSON.parse(user));
    console.log({ userId });

    try {
      const orderDetail = await this.db
        .insert(orderDetailSchema)
        .values({
          totalAmount: amount,
          paymentMethodId: 1,
          deliveryMethodId: 1,
        })
        .returning({ orderDetailId: orderDetailSchema.id });

      console.log("userOrders", orderDetail[0]);

      const userOrders = await this.db
        .insert(usersOrders)
        .values({
          userId,
          orderDetailId: orderDetail[0].orderDetailId,
        })
        .returning();

      console.log("userOrders", userOrders);

      const userSubscription = await this.db
        .insert(subscription)
        .values({
          stripeCustomerId: "harry",
          stripeSubscriptionId: paymentIntendId,
          stripPriceId: "test123",
          stripeCurrentPeriodEnd: new Date().toISOString(),
          orderDetailId: orderDetail[0].orderDetailId,
        })
        .returning();

      console.log("userSubscription", userSubscription);

      const productId = JSON.parse(products).map((product) => {
        return {
          orderDetailId: orderDetail[0].orderDetailId,
          productId: product.productId,
          quantity: product.quantity,
        };
      });
      const orderProductsInsert = await this.db
        .insert(orderProducts)
        .values(productId)
        .returning();

      console.log("orderProductsInsert", orderProductsInsert);

      console.log({
        orderDetail,
        userSubscription,
        userOrders,
        orderProductsInsert,
      });

      return {
        status: 200,
        message: "Order successfully",
      };

      // return customers.data;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException("Failed to create order");
    }
  }

  async createProduct(productValues: ProductValuesType) {
    const { productName, description, price, currency, imageUrl } =
      productValues;

    const product = await this.stripe.products.create({
      name: productName,
      description,
      images: [imageUrl],
      metadata: {
        productId: 1,
      },
    });

    const productPrice = this.stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency,
    });

    console.log({ product, productPrice });

    return {
      product,
      productPrice,
    };
  }

  async getProduct(productId: string) {
    const product = await this.stripe.products.retrieve(productId);
    // return await this.stripe.products.list();

    return product;
  }

  async getAllProducts() {
    const products = await this.stripe.products.list();

    console.log({ products });

    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        // Fetch prices for each product
        const prices = await this.stripe.prices.list({
          product: product.id,
        });

        console.log(prices.data);

        // Return product details along with the first price (or all prices if needed)
        return {
          ...product,
          price: {
            id: prices.data[0]?.id,
            unit_amount: prices.data[0]?.unit_amount,
            currency: prices.data[0]?.currency,
          }, // Get the first price and its unit amount
          currency: prices.data[0]?.currency, // Get the currency of the price
        };
      })
    );

    return productsWithPrices;
  }

  testEnv() {
    console.log(process.env.MOIMOC_DOMAIN);
  }

  async createCheckoutSession(checkoutValues: OrderValuesType, userId: string) {
    const successUrl = process.env.MOIMOC_DOMAIN;
    const cancelUrl = process.env.MOIMOC_DOMAIN;

    let url = "";

    const { user, address, phone, method, paymentMethod, products } =
      checkoutValues;

    const { avatar, ...info } = user;

    const isExistUser = await this.db.query.user.findFirst({
      where: (userSchema, { eq }) => eq(userSchema.id, Number(userId)),
    });

    if (!isExistUser) {
      throw new NotFoundException("User invalid.");
    }

    const getProductId = products.map((product) => Number(product.productId));

    const isExistingProducts = await this.db
      .select()
      .from(product)
      .where(inArray(product.id, getProductId));

    if (isExistingProducts.length === 0) {
      throw new NotFoundException("Sản phẩm không tồn tại");
    }

    const orderedProducts = products.filter((product) => {
      return isExistingProducts.find((existingProduct) => {
        return existingProduct.id === product.productId;
      });
    });

    const line_items = orderedProducts.map((product) => {
      return {
        price_data: {
          currency: "VND",
          product_data: {
            name: product.productName,
            description: product.productDescription,
            images: [product.imageUrl],
          },
          unit_amount: product.discountPrice
            ? Number(product.discountPrice)
            : Number(product.price),
        },
        quantity: Number(product.quantityOrder),
      };
    });

    const productInformation = products.map((product) => {
      return {
        productId: product.productId,
        quantity: product.quantityOrder,
      };
    });

    try {
      const userSubscription = await this.db
        .select()
        .from(subscription)
        .where(eq(subscription.stripeCustomerId, userId));

      if (userSubscription[0] && userSubscription[0].stripeCustomerId) {
        const stripeSession = await this.stripe.billingPortal.sessions.create({
          customer: "test",
          return_url: `${process.env.DOMAIN}`,
        });

        url = stripeSession.url;
      } else {
        const stripSession = await this.stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          billing_address_collection: "auto",
          customer_email: user.email || null,
          metadata: {
            user: info.id.toString(),
            products: JSON.stringify(productInformation),
            address,
            phone,
            method,
            paymentMethod,
          },
          line_items: line_items,
          success_url: successUrl,
          cancel_url: cancelUrl,
        });

        url = stripSession.url || "";
      }

      return {
        paymentUrl: url,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException("Thanh toán thất bại", 500);
    }
  }

  async webhookData(raw: any, signature: string) {
    let event: Stripe.Event;

    console.log({ raw, signature });

    const signInSecretLocal =
      "whsec_7c5951bf1e6c8fac053e102d1970b46cbd13ee010bf28a865cd2275de4c86375";

    try {
      // const rawBody = JSON.stringify(req.body);
      event = await this.stripe.webhooks.constructEvent(
        raw,
        signature,
        signInSecretLocal
      );
    } catch (error) {
      console.log("webhook error: ", error);
      throw new HttpException("Webhook signature verification failed.", 400);
    }

    console.log("Event received: ", event.type);

    if (event.type === "checkout.session.completed") {
      // Retrieve session details
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Checkout Session:", session);

      const metadata = session.metadata; // Access metadata here
      const paymentIntentId = session.payment_intent; // If you need payment intent ID

      console.log("Metadata:", metadata);

      if (metadata) {
        const { amount_total } = session;
        const result = await this.customerOrdered(
          paymentIntentId as string,
          metadata,
          amount_total
        );

        console.log({ result });
        return result;
      }
    } else if (event.type === "payment_intent.succeeded") {
      console.log("Payment Intent Succeeded:", event.data.object);
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  async retrieveBalance() {
    const balance = await this.stripe.balance.retrieve();

    return balance;
  }

  async getBillings() {
    const subscriptions = await this.stripe.invoices.list({
      status: "open",
    });

    console.log({ subscriptions });

    return subscriptions.data;
  }
}

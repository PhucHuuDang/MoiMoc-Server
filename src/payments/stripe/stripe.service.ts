import { product } from "./../../drizzle/schema/product.schema";
import {
  HttpException,
  Inject,
  Injectable,
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

    const { id: userId } = JSON.parse(user);

    const orderDetail = await this.db
      .insert(orderDetailSchema)
      .values({
        totalAmount: amount,
        paymentMethodId: Number(paymentMethod),
        deliveryMethodId: Number(method),
      })
      .returning({ orderDetailId: orderDetailSchema.id });

    const userSubscription = await this.db.insert(subscription).values({
      stripeCustomerId: userId,
      stripeSubscriptionId: paymentIntendId,
      stripPriceId: amount.toString(),
      stripeCurrentPeriodEnd: "",
      orderDetailId: orderDetail[0].orderDetailId,
    });

    const userOrders = await this.db.insert(usersOrders).values({
      userId,
      orderDetailId: orderDetail[0].orderDetailId,
    });

    const productId = JSON.parse(products).map((product) => {
      return {
        orderDetailId: orderDetail[0].orderDetailId,
        productId: product.productId,
      };
    });
    const orderProductsInsert = await this.db
      .insert(orderProducts)
      .values(productId);

    // const customers = await

    return {
      message: "Order successfully",
    };

    // return customers.data;
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

    const metadata = {
      user: JSON.stringify(info),
      products: JSON.stringify(
        products.map((product) => {
          return {
            productId: product.productId,
            quantity: product.quantityOrder,
          };
        })
      ),
      address,
      phone,
      method,
      paymentMethod,
    };

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
          metadata,
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

    const signInSecretLocal =
      "whsec_7c5951bf1e6c8fac053e102d1970b46cbd13ee010bf28a865cd2275de4c86375";

    try {
      // const rawBody = JSON.stringify(req.body);
      event = this.stripe.webhooks.constructEvent(
        raw,
        signature,
        signInSecretLocal
      );
    } catch (error) {
      console.log("webhook error: ", error);
      // console.error("Webhook signature verification failed.");
      throw new HttpException("Webhook signature verification failed.", 400);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    console.log({ session });

    //* the account of the user
    // if (!session.metadata.phoneAuth) {
    //   throw new HttpException("User not authenticated", 400);
    // }

    // if (event.type === "payment_intent.succeeded") {
    //   const paymentIntent = event.data.object as Stripe.PaymentIntent;

    //   const { id: paymentIntendId, metadata } = paymentIntent;

    //   try {
    //     const paymentData = await this.stripe.paymentIntents.retrieve(
    //       paymentIntent.id as string
    //     );

    //     console.log(paymentData.metadata);
    //   } catch (error) {}
    // }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { id: paymentIntendId, metadata, amount } = paymentIntent;

        this.customerOrdered(paymentIntendId, metadata, amount);

        console.log({ paymentIntent });
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );

        break;

      case "payment_method.attached":
        const paymentMethod = event.data.object;

        console.log({ paymentMethod });
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;

      default:
        console.error(`Unhandled event type: ${event.type}`);
    }

    // res.status(200).json({ received: true });
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

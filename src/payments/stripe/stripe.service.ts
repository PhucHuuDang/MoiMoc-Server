import { product } from "./../../drizzle/schema/product.schema";
import { Inject, Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { ProductValuesType } from "./types/stripe-types";
import { absoluteUrl } from "../lib/absolute-url";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import { subscription } from "src/drizzle/schema/subscription.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    });
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

    // return await this.stripe.products.create({
    //   name: productName,
    //   description,
    // });
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

  async createCheckoutSession(
    checkoutValues: {
      email: string;
      price: number;
      name: string;
      description: string;
      imageUrl: string;
      phoneAuth: string;
    },
    userId: string
  ) {
    let url = "";

    const { email, price, name, description, imageUrl, phoneAuth } =
      checkoutValues;

    const successUrl = absoluteUrl("/success?session_id={CHECKOUT_SESSION_ID}");
    const cancelUrl = absoluteUrl("/cancel?session_id={CHECKOUT_SESSION_ID}");

    try {
      const userSubscription = await this.db
        .select()
        .from(subscription)
        .where(eq(subscription.stripeCustomerId, userId));

      if (userSubscription[0] && userSubscription[0].stripeCustomerId) {
        const stripeSession = await this.stripe.billingPortal.sessions.create({
          customer: "test",
          return_url: "https://example.com/harrydangaccount",
        });

        url = stripeSession.url;
      } else {
        const stripSession = await this.stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          billing_address_collection: "auto",
          customer_email: email || null,
          metadata: {
            phone: "0814593739", // Store the phone number in metadata
            userId: 54,
          },
          // shipping_address_collection: {
          //   allowed_countries: ["US", "VN"],
          // },
          line_items: [
            {
              price_data: {
                currency: "VND",
                product_data: {
                  name,
                  description,
                  images: [imageUrl, imageUrl],
                },
                unit_amount: price,
                // recurring: { interval: "" },
              },
              quantity: 1,
            },
            // {
            //   price_data: {
            //     currency: "VND",
            //     product_data: {
            //       name,
            //       description,
            //       images: [imageUrl],
            //     },

            //     unit_amount: price,
            //     // recurring: { interval: "" },
            //   },
            //   quantity: 2,
            // },
            // {
            //   price_data: {
            //     currency: "VND",
            //     product_data: {
            //       name,
            //       description,
            //       images: [imageUrl],
            //     },
            //     unit_amount: price,
            //     // recurring: { interval: "" },
            //   },
            //   quantity: 1,
            // },
          ],

          success_url: successUrl,
          cancel_url: cancelUrl,
        });

        url = stripSession.url || "";
      }

      return {
        paymentUrl: url,
      };
    } catch (error) {
      console.log({ error });
    }
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

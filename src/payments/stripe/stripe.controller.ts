import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
  Request,
  Response,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { ProductValuesType } from "./types/stripe-types";
import Stripe from "stripe";

@Controller("stripe")
export class StripeController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    typescript: true,
  });
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  createProduct(@Body() productValues: ProductValuesType) {
    const { productName, description, price, currency } = productValues;

    if (!productName || !description || !price || !currency) {
      throw new HttpException("Product values are required", 400);
    }

    const result = this.stripeService.createProduct(productValues);

    // console.log({ result });

    return result;
  }

  @Post("/payment")
  async createCheckoutSession(
    @Request() req: any,
    @Body()
    checkoutValues: {
      email: string;
      price: number;
      name: string;
      description: string;
      imageUrl: string;
      phoneAuth: string;
    }
  ) {
    const userId = "58";
    const { name, description, price, email } = checkoutValues;

    if (!name || !description || !price || !userId) {
      throw new HttpException("Product values are required", 400);
    }

    const result = await this.stripeService.createCheckoutSession(
      checkoutValues,
      userId
    );

    console.log({ result });

    return result;
  }

  @Post("/webhook")
  async handleWebhook(
    @Headers("stripe-signature") signature: string,
    @Request() req: any,
    @Response() res: any
  ) {
    let event: Stripe.Event;

    console.log({ signature, req, res });

    console.log(process.env.WEBHOOK_SECRET_KEY);

    try {
      const rawBody = req.rawBody.toString();
      console.log({ rawBody });
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.WEBHOOK_SECRET_KEY
      );
    } catch (error) {
      console.error("Webhook signature verification failed.");
      throw new HttpException("Webhook signature verification failed.", 400);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    console.log({ session });

    //* the account of the user
    if (!session.metadata.phoneAuth) {
      throw new HttpException("User not authenticated", 400);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log({ paymentIntent });
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );

        break;

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log({ paymentIntent });

        // Log the success of the payment
        console.log(`Payment for ${paymentIntent.amount} was successful!`);

        // Handle storing or updating payment status in the database
        // await this.savePaymentDetails(paymentIntent);

        break;
      }

      case "payment_method.attached":
        const paymentMethod = event.data.object;

        console.log({ paymentMethod });
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;

      default:
        console.error(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }

  @Get("balance")
  async retrieveBalance() {
    const balance = await this.stripeService.retrieveBalance();

    console.log({ balance });
    return balance;
  }

  @Get("session")
  async handleSession() {
    const session = await this.stripe.checkout.sessions.retrieve(
      "cs_test_b1GHfpIuygxeDHHuD8mdmBNiHiiCRZ0YFO7a5QHn29Yyt9awVa1K2A2WCY"
    );

    // const customer = await this.stripe.customers.retrieve(session.customer);

    console.log({ session });

    return session;
  }

  @Get("/detail/:productId")
  getProduct(@Param("productId") productId: string) {
    const product = this.stripeService.getProduct(productId);
    return product;
  }

  @Get()
  getAllProducts() {
    const products = this.stripeService.getAllProducts();
    return products;
  }

  @Get("/billings")
  getBillings() {
    const subscriptions = this.stripeService.getBillings();
    return subscriptions;
  }
}

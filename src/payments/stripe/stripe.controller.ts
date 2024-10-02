import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Request,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { ProductValuesType } from "./types/stripe-types";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  createProduct(@Body() productValues: ProductValuesType) {
    const { productName, description, price, currency } = productValues;

    if (!productName || !description || !price || !currency) {
      throw new HttpException("Product values are required", 400);
    }

    const result = this.stripeService.createProduct(productValues);

    console.log({ result });

    return result;
  }

  @Post("/payment")
  createCheckoutSession(
    @Request() req: any,
    @Body()
    productValues: {
      email: string;
      price: number;
      name: string;
      description: string;
    }
  ) {
    const userId = "58";
    const { name, description, price, email } = productValues;

    if (!name || !description || !price || !userId) {
      throw new HttpException("Product values are required", 400);
    }

    const result = this.stripeService.createCheckoutSession(
      productValues,
      userId
    );

    console.log({ result });

    return result;
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

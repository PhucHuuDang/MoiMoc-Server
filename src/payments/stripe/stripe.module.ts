import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { ConfigService } from "@nestjs/config";
import { ProductsService } from "src/products/products.service";
import { ProductsModule } from "src/products/products.module";

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  imports: [DrizzleModule],
})
export class StripeModule {}

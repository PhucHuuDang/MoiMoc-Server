import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { ConfigService } from "@nestjs/config";
import { ProductsService } from "src/products/products.service";
import { ProductsModule } from "src/products/products.module";
import { RawBodyMiddleware } from "src/raw-body.middleware";
import { JsonBodyMiddleware } from "src/json-body.middleware";

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  imports: [DrizzleModule],
})
// export class StripeModule {}
export class StripeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: "/stripe/webhook",
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes("*");
  }
}

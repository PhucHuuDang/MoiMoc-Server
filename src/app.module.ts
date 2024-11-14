import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { PhoneModule } from "./phone/phone.module";
import { ProductsModule } from "./products/products.module";
import { ProductImagesModule } from "./product-images/product-images.module";
import { ProductCategoryModule } from "./product-category/product-category.module";
import { CommentsModule } from "./comments/comments.module";
import { AddressModule } from "./address/address.module";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { AuthModule } from "./auth/auth.module";
import { StripeModule } from "./payments/stripe/stripe.module";
import { PaymentMethodsModule } from "./payment-methods/payment-methods.module";
import { DiscussionModule } from "./discussion/discussion.module";
import { RawBodyMiddleware } from "./raw-body.middleware";
import { JsonBodyMiddleware } from "./json-body.middleware";
import { DeliveryMethodsModule } from './delivery-methods/delivery-methods.module';
import { PayosModule } from './payos/payos.module';
import { AboutMoiMocModule } from './about-moi-moc/about-moi-moc.module';
import { ImagesModelsModule } from './images-models/images-models.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    UserModule,
    PhoneModule,
    ProductsModule,
    ProductImagesModule,
    ProductCategoryModule,
    CommentsModule,
    AddressModule,
    IngredientsModule,
    AuthModule,
    StripeModule,
    PaymentMethodsModule,
    DiscussionModule,
    DeliveryMethodsModule,
    PayosModule,
    AboutMoiMocModule,
    ImagesModelsModule,
    FeedbackModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService, RawBodyMiddleware, JsonBodyMiddleware],
})
// export class AppModule {}
export class AppModule implements NestModule {
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

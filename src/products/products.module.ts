import { Module, forwardRef } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductImagesService } from "src/product-images/product-images.service";
import { ProductImagesModule } from "src/product-images/product-images.module";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { CommentsModule } from "src/comments/comments.module";
import { CommentsService } from "src/comments/comments.service";
import { StripeModule } from "src/payments/stripe/stripe.module";
import { StripeService } from "src/payments/stripe/stripe.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductImagesService, CommentsService],
  imports: [
    DrizzleModule,
    ProductImagesModule,
    forwardRef(() => CommentsModule),
  ],
})
export class ProductsModule {}

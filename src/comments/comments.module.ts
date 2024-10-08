import { Module, forwardRef } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { ProductsService } from "src/products/products.service";
import { ProductsModule } from "src/products/products.module";
import { ProductImagesModule } from "src/product-images/product-images.module";
import { ProductImagesService } from "src/product-images/product-images.service";
import { DiscussionModule } from "src/discussion/discussion.module";

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, ProductsService, ProductImagesService],
  imports: [
    DrizzleModule,
    forwardRef(() => ProductsModule),
    ProductImagesModule,
  ],
})
export class CommentsModule {}

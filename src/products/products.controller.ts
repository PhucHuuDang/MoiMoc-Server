import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import {
  ProductShapeType,
  newProductProps,
} from "src/drizzle/schema/product.schema";
import { InsertProductImagesProps } from "src/drizzle/schema/product-images.schema";
import { InsertProductTypeProps } from "src/drizzle/schema/product-type.schema";

@Controller("products")
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Post()
  createProduct(@Body() newProductProps: newProductProps) {
    console.log({ newProductProps });
    return this.productService.createProduct(newProductProps);
  }

  @Delete()
  deleteProduct(@Param() productId: number) {
    return this.productService.deleteProduct(productId);
  }

  @Get(":productId")
  findProductById(@Param("productId") productId: number) {
    console.log(productId);
    const numericProductId = Number(productId);
    if (!productId) {
      throw new BadRequestException("Invalid productId");
    }
    return this.productService.findDetailProduct(productId);
  }
}

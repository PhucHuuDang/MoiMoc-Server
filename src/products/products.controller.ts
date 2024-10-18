import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import {
  ProductShapeType,
  newProductProps,
  UpdateProductProps,
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

  @Get(":productId")
  findProductById(@Param("productId") productId: number) {
    if (!productId) {
      throw new BadRequestException("Invalid productId");
    }
    return this.productService.findDetailProduct(productId);
  }

  @Get("/search/:productId")
  async justDataProduct(@Param("productId") productId: number) {
    if (!productId) {
      throw new BadRequestException("Invalid productId");
    }
    return this.productService.findDataProductItSelf(productId);
  }

  @Post()
  createProduct(@Body() newProductProps: newProductProps) {
    console.log({ newProductProps });
    return this.productService.createProduct(newProductProps);
  }

  @Delete(":productId")
  deleteProduct(@Param("productId") productId: number) {
    if (!productId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Invalid productId",
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: "Invalid productId",
        }
      );
    }

    return this.productService.deleteProduct(productId);
  }

  @Put(":productId")
  updateProduct(
    @Param("productId") productId: number,
    @Body() updateProduct: UpdateProductProps
  ) {
    if (!productId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Invalid productId",
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: "Invalid productId",
        }
      );
    } else if (!updateProduct) {
      throw new HttpException(
        "Lack of data to update product",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.productService.updateProduct(productId, updateProduct);
  }
}

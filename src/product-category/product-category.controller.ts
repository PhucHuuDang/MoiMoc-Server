import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ProductCategoryService } from "./product-category.service";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { InsertProductTypeProps } from "src/drizzle/schema/product-type.schema";

@Controller("product-category")
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}

  @Post()
  create(@Body() createProductCategoryDto: InsertProductTypeProps) {
    return this.productCategoryService.createProductCategory(
      createProductCategoryDto
    );
  }

  @Get()
  findAll() {
    return this.productCategoryService.findAllProductCategory();
  }

  @Get(":id")
  findProductCategory(@Param("id") id: string) {
    return this.productCategoryService.findProductCategory(+id);
  }

  @Patch(":productTypeId")
  update(
    @Param("productTypeId") productTypeId: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto
  ) {
    return this.productCategoryService.updateCategory(
      +productTypeId,
      updateProductCategoryDto
    );
  }

  @Delete(":productTypeId")
  remove(@Param("productTypeId") productTypeId: string) {
    return this.productCategoryService.deleteCategory(+productTypeId);
  }
}

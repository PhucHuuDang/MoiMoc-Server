import { Inject, Injectable } from "@nestjs/common";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  InsertProductTypeProps,
  SelectProductTypeProps,
  productType,
} from "src/drizzle/schema/product-type.schema";
import { and, eq } from "drizzle-orm";
import { product } from "src/drizzle/schema/product.schema";

@Injectable()
export class ProductCategoryService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async createProductCategory(
    createProductCategoryDto: InsertProductTypeProps
  ): Promise<{ message: string; category: SelectProductTypeProps }> {
    const newCategory = await this.db
      .insert(productType)
      .values(createProductCategoryDto)
      .returning();

    return {
      message: "Product category created successfully",
      category: newCategory[0],
    };
  }

  async findAllProductCategory() {
    const categories = await this.db.query.productType.findMany();

    return categories;
  }

  async findProductCategory(productTypeId: number) {
    const categoryDetail = await this.db
      .select({
        id: productType.id,
        name: productType.type,
      })
      .from(productType)
      .where(eq(productType.id, productTypeId));

    return categoryDetail;
  }

  async updateCategory(
    productTypeId: number,
    updateProductCategoryValues: UpdateProductCategoryDto
  ) {
    let updateCategory;
    try {
      updateCategory = await this.db
        .update(productType)
        .set(updateProductCategoryValues)
        .where(eq(productType.id, productTypeId))
        .returning();
    } catch (error) {
      throw new Error(error);
    }

    return {
      message: "Product category updated successfully",
      category: updateCategory[0],
    };
  }

  async deleteCategory(productTypeId: number) {
    const deleteCategory = await this.db
      .delete(productType)
      .where(eq(productType.id, productTypeId))
      .returning({ type: productType.type });

    return {
      message: `Deleted ${deleteCategory[0].type} category successfully`,
    };
  }
}

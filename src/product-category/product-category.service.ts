import { Inject, Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDbType } from 'types/drizzle';
import {
  InsertProductTypeProps,
  SelectProductTypeProps,
  productType,
} from 'src/drizzle/schema/product-type.schema';

@Injectable()
export class ProductCategoryService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async createProductCategory(
    createProductCategoryDto: InsertProductTypeProps,
  ): Promise<{ message: string; category: SelectProductTypeProps }> {
    const newCategory = await this.db
      .insert(productType)
      .values(createProductCategoryDto)
      .returning();

    return {
      message: 'Product category created successfully',
      category: newCategory[0],
    };
  }

  async findAllProductCategory() {
    const categories = await this.db.query.productType.findMany();

    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return `This action updates a #${id} productCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}

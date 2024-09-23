import { Inject, Injectable } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDbType } from 'types/drizzle';
import {
  InsertProductImagesProps,
  SelectProductImagesProps,
  productImages,
} from 'src/drizzle/schema/product-images.schema';

@Injectable()
export class ProductImagesService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async addProductImages(createImagesProduct: InsertProductImagesProps[]) {
    const insertImagesProduct = await this.db
      .insert(productImages)
      .values(createImagesProduct)
      .returning({ imagesProductId: productImages.id });

    return insertImagesProduct;
  }

  async findAll(): Promise<SelectProductImagesProps[] | []> {
    const productImages = await this.db.query.productImages.findMany({
      with: {
        product: true,
      },
    });

    return productImages.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      productId: image.productId,
      product: image.product ? { ...image.product } : undefined,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} productImage`;
  }

  update(id: number, updateProductImageDto: UpdateProductImageDto) {
    return `This action updates a #${id} productImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} productImage`;
  }
}

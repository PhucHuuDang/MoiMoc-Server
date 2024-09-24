import { Inject, Injectable } from "@nestjs/common";
import { CreateProductImageDto } from "./dto/create-product-image.dto";
import { UpdateProductImageDto } from "./dto/update-product-image.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  InsertProductImagesProps,
  SelectProductImagesProps,
  UpdateProductImagesProps,
  productImages,
} from "src/drizzle/schema/product-images.schema";
import { eq } from "drizzle-orm";

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

  async findImagesByProductId(productId: number) {
    return await this.db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId));
  }

  async updateProductImages(
    productId: number,
    updateProductImages: UpdateProductImagesProps[]
  ) {
    for (const image of updateProductImages) {
      if (image.imageId) {
        await this.db
          .update(productImages)
          .set({ imageUrl: image.imageUrl })
          .where(eq(productImages.id, image.imageId));
      } else {
        await this.db
          .insert(productImages)
          .values({ imageUrl: image.imageUrl, productId })
          .returning({ imagesProductId: productImages.id });
      }
    }

    return await this.db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId));
  }
}

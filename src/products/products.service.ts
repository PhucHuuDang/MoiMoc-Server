import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import {
  InsertProductImagesProps,
  productImages,
} from 'src/drizzle/schema/product-images.schema';
import {
  ProductShapeType,
  SelectProductProps,
  newProductProps,
  product,
} from 'src/drizzle/schema/product.schema';
import { ProductImagesService } from 'src/product-images/product-images.service';
import { DrizzleDbType } from 'types/drizzle';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,
    private readonly productImages: ProductImagesService,
  ) {}

  async findAllProducts(): Promise<SelectProductProps[] | []> {
    const productsFilter = await this.db.query.product.findMany({
      with: {
        productImages: true,
        productType: true,
        comments: true,
        custom: true,
      },
    });

    const products = productsFilter.map((product) => ({
      productId: product.id,
      ...product,

      //* relationship schema data
      productImages: product.productImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        productId: image.productId,
      })),
      productType: product.productType ? { ...product.productType } : undefined,
      comments: product.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        productId: comment.productId,
      })),
      custom: product.custom ? { ...product.custom } : undefined,
    }));

    return products;
  }

  async createProduct(insertProductProps: newProductProps) {
    // insertProductProps.productId

    console.log({ insertProductProps });

    const { imageUrl, price, ...props } = insertProductProps;

    const priceAsNumber = parseFloat(price);

    const calculateDiscountPrice = props.discountPercentage
      ? priceAsNumber - (priceAsNumber * props.discountPercentage) / 100
      : undefined;

    const insertValues: any = {
      ...props,
      price: priceAsNumber,
    };

    if (calculateDiscountPrice !== undefined) {
      insertValues.discountPrice = calculateDiscountPrice;
    }

    console.log({ calculateDiscountPrice });

    const newProduct = await this.db
      .insert(product)
      .values(insertValues)
      .returning({ productId: product.id, productName: product.productName });

    const productId = newProduct[0].productId;

    const transformedImages = imageUrl.map((url) => ({
      productId,
      imageUrl: url,
    }));

    console.log({ transformedImages });

    // const newProductImages = await this.db
    //   .insert(productImages)
    //   .values({
    //     transformedImages,
    //   })
    //   .returning();
    const newProductImages =
      await this.productImages.addProductImages(transformedImages);

    console.log({ newProductImages });

    return {
      message: 'Product created successfully',
      productId,
      newProduct: newProduct[0].productName,
      productImages: newProductImages[0],
    };
  }
}

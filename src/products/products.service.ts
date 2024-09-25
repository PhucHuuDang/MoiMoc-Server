import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { comment } from "src/drizzle/schema/comment.schema";
import { feedback } from "src/drizzle/schema/feedback.schema";
import {
  InsertProductImagesProps,
  productImages,
} from "src/drizzle/schema/product-images.schema";
import { productType } from "src/drizzle/schema/product-type.schema";
import {
  ProductShapeType,
  SelectProductProps,
  newProductProps,
  product,
  UpdateProductProps,
} from "src/drizzle/schema/product.schema";
import { ProductImagesService } from "src/product-images/product-images.service";
import { DrizzleDbType } from "types/drizzle";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,
    private readonly productImages: ProductImagesService
  ) {}

  // * find
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

  async findDetailProduct(productId: number) {
    const productFilter = await this.db
      .select({
        // Selecting the product fields
        productId: product.id,
        productName: product.productName,
        productDescription: product.productDescription,
        price: product.price,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        quantity: product.quantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        // Selecting fields from related tables
        productImageId: productImages.id,
        productImageUrl: productImages.imageUrl,
        productTypeName: productType.type,

        commentId: comment.id,
        commentContent: comment.content,

        // feedbackId: feedback.id,
        // feedbackContent: feedback.content,
        // feedbackUserId: feedback.userId,
        // feedbackProductId: feedback.productId,
      })
      .from(product)
      // Join related tables
      .leftJoin(productImages, eq(productImages.productId, product.id)) // 1-to-many relation (productImages)
      .leftJoin(productType, eq(productType.id, product.productTypeId)) // 1-to-1 relation (productType)
      .leftJoin(comment, eq(comment.productId, product.id)) // 1-to-many relation (comments)
      // .leftJoin(feedback, eq(feedback.productId, product.id)) // 1-to-many relation (feedback)
      .where(eq(product.id, productId))
      .limit(1);

    console.log({ productFilter });

    if (!productFilter) {
      return null; // Handle case where no product is found
    }

    const getProductOrder = productFilter[0];

    const productDetail = {
      productId: getProductOrder.productId,
      productName: getProductOrder.productName,
      description: getProductOrder.productDescription,
      price: getProductOrder.price,
      discountPrice: getProductOrder.discountPrice,
      discountPercentage: getProductOrder.discountPercentage,
      quantity: getProductOrder.quantity,
      createdAt: getProductOrder.createdAt,
      updatedAt: getProductOrder.updatedAt,
      productImages: productFilter
        .map((image) => ({
          id: image.productImageId,
          imageUrl: image.productImageUrl,
        }))
        .filter((img) => img.id !== null), // Filter out null images
      productType: productFilter[0].productTypeName
        ? { type: productFilter[0].productTypeName }
        : undefined,

      comments: Array.from(
        new Map(
          productFilter.map((comment) => [
            comment.commentId,
            { id: comment.commentId, content: comment.commentContent },
          ])
        ).values()
      ),

      // comments: productFilter
      //   .map((comment) => ({
      //     id: comment.commentId,
      //     content: comment.commentContent,
      //   }))
      //   .filter((c) => c.id !== null), // Filter out null comments

      // testComments: productFilter[0].co
      // feedback: productFilter
      //   .map((feedback) => ({
      //     id: feedback.feedbackId,
      //     content: feedback.feedbackContent,
      //     userId: feedback.feedbackUserId,
      //     productId: feedback.feedbackProductId,
      //   }))
      //   .filter((f) => f.id !== null), // Filter out null feedback
    };

    console.log(productDetail);

    return productDetail;
  }

  // * createProduct
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
      message: "Product created successfully",
      productId,
      newProduct: newProduct[0].productName,
      productImages: newProductImages[0],
    };
  }

  async deleteProduct(productId: number) {
    const deleteProduct = await this.db
      .delete(product)
      .where(eq(product.id, productId))
      .returning();

    return {
      message: `Deleted ${deleteProduct[0].productName} successfully `,
    };
  }

  async updateProduct(productId: number, updateProduct: UpdateProductProps) {
    console.log({ updateProduct });

    const { images, price, ...props } = updateProduct;

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

    const existingProductImages =
      await this.productImages.findImagesByProductId(productId);

    const updateProductDb = await this.db
      .update(product)
      .set(insertValues)
      .where(eq(product.id, productId))
      .returning();

    // const productId = newProduct[0].productId;

    const transformedImages = images.map((url, index) => ({
      imageId: existingProductImages[index]?.id,
      productId: url.productId,
      imageUrl: url.imageUrl,
    }));

    console.log({ transformedImages });

    // const newProductImages = await this.db
    //   .insert(productImages)
    //   .values({
    //     transformedImages,
    //   })
    //   .returning();

    const updateProductImages = await this.productImages.updateProductImages(
      productId,
      transformedImages
    );

    console.log({ updateProductImages });

    return {
      message: `Updated ${updateProductDb[0].productName} successfully`,
      productId,
      updateProduct: updateProductDb[0].productName,
      productImages: updateProductImages[0],
    };
  }
}

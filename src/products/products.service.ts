import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { SQL, eq, inArray, sql } from "drizzle-orm";
import { CommentsService } from "src/comments/comments.service";
import { DiscussionService } from "src/discussion/discussion.service";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { comment } from "src/drizzle/schema/comment.schema";
import { discussion } from "src/drizzle/schema/discussion.schema";
import { feedback } from "src/drizzle/schema/feedback.schema";
import { ingredientsInProducts } from "src/drizzle/schema/ingredients-in-products.schema";
import { ingredients } from "src/drizzle/schema/ingredients.schema";
import {
  InsertProductImagesProps,
  productImages,
} from "src/drizzle/schema/product-images.schema";
import { productType } from "src/drizzle/schema/product-type.schema";
import {
  SelectProductProps,
  newProductProps,
  product,
  UpdateProductProps,
} from "src/drizzle/schema/product.schema";
import { user } from "src/drizzle/schema/user.schema";
import { StripeService } from "src/payments/stripe/stripe.service";
import { ProductImagesService } from "src/product-images/product-images.service";
import { DrizzleDbType } from "types/drizzle";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,
    private readonly productImagesService: ProductImagesService,

    //* these 2 way handle
    //* @Inject(REQUEST) ==> we should not use this way
    @Inject(forwardRef(() => CommentsService))
    private readonly commentService: CommentsService
    // private readonly discussionService: DiscussionService
  ) {
    // console.log({ db });
  }

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
        productId: product.id,
        productName: product.productName,
        productDescription: product.productDescription,
        details: product.details,
        usage: product.usage,
        expireDate: product.expireDate,
        price: product.price,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        quantity: product.quantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        productTypeName: productType.type,
      })
      .from(product)
      .leftJoin(productType, eq(productType.id, product.productTypeId))
      .where(eq(product.id, productId))
      .limit(1);

    console.log({ productFilter });

    if (!productFilter || productFilter.length === 0) {
      return null; // Handle case where no product is found
    }

    const productDetailData = productFilter[0];

    //* images of product
    const productImages =
      await this.productImagesService.findImagesByProductId(productId);

    //* comments of product
    const commentsProductDetail =
      await this.commentService.findCommentByProductId(productId);

    //* discussion of product

    const discussionProductDetail = await this.db
      .select({
        id: discussion.id,
        discussionContent: discussion.content,
        createdAt: discussion.createdAt,
        updatedAt: discussion.updatedAt,
        user: {
          userId: user.id,
          username: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      })
      .from(discussion)
      .leftJoin(user, eq(user.id, discussion.userId))
      .where(eq(discussion.productId, productId));

    //* ingredients of product
    const ingredientsProductDetail = await this.db
      .select()
      .from(ingredientsInProducts)
      .where(eq(ingredientsInProducts.productId, productId));

    const ingredientIds = ingredientsProductDetail.map((ingredient) => {
      return ingredient.ingredientId;
    });

    const ingredientsDetail = await this.db
      .select({
        ingredientId: ingredients.id,
        ingredientName: ingredients.ingredient,
      })
      .from(ingredients)
      .where(inArray(ingredients.id, ingredientIds));

    const productDetail = {
      productId: productDetailData.productId,
      productName: productDetailData.productName,
      description: productDetailData.productDescription,
      details: productDetailData.details,
      usage: productDetailData.usage,
      expireDate: productDetailData.expireDate,
      price: productDetailData.price,
      discountPrice: productDetailData.discountPrice,
      discountPercentage: productDetailData.discountPercentage,
      quantity: productDetailData.quantity,
      createdAt: productDetailData.createdAt,
      updatedAt: productDetailData.updatedAt,
      productImages,
      comments: commentsProductDetail,
      discussion: discussionProductDetail,
      ingredients: ingredientsDetail,
    };

    console.log(productDetail);

    return productDetail;
  }

  async findDataProductItSelf(productId: number) {
    if (!productId) {
      throw new BadRequestException("Invalid productId");
    }

    const productFilter = this.db
      .select({
        productId: product.id,
        productName: product.productName,
        productDescription: product.productDescription,
        details: product.details,
        usage: product.usage,
        expireDate: product.expireDate,
        price: product.price,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        quantity: product.quantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        productType: {
          id: productType.id,
          type: productType.type,
        },
      })
      .from(product)
      .leftJoin(productType, eq(productType.id, product.productTypeId))
      .where(eq(product.id, sql.placeholder("id")))
      .prepare("productFilter");

    if (!productFilter) {
      return null;
    }

    const productImages =
      await this.productImagesService.findImagesByProductId(productId);

    const ingredientsProductDetail = this.db
      .select({
        ingredientId: ingredients.id,
        ingredientName: ingredients.ingredient,
      })
      .from(ingredientsInProducts)
      .leftJoin(
        ingredients,
        eq(ingredients.id, ingredientsInProducts.ingredientId)
      )
      .where(eq(ingredientsInProducts.productId, sql.placeholder("id")))
      .prepare("ingredientsProductDetail");

    const productData = await productFilter.execute({ id: productId });
    const ingredientsInProduct = await ingredientsProductDetail.execute({
      id: productId,
    });

    const resultData = {
      ...productData[0],
      ingredients: ingredientsInProduct,
      productImages,
    };

    return resultData;
  }

  // * createProduct
  async createProduct(insertProductProps: newProductProps) {
    // insertProductProps.productId

    console.log({ insertProductProps });

    const {
      imageUrl,
      price,
      ingredients: ingredientsId,
      ...props
    } = insertProductProps;

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

    // find exist ingredients
    const existingIngredients = await this.db
      .select()
      .from(ingredients)
      .where(inArray(ingredients.id, ingredientsId));

    console.log({ existingIngredients });

    const transformedIngredients = existingIngredients.map((ingredient) => ({
      productId, //
      ingredientId: ingredient.id,
    }));

    console.log({ transformedImages });

    const newProductImages =
      await this.productImagesService.addProductImages(transformedImages);

    console.log({ newProductImages });

    // ingredientsInProducts

    const newIngredientsInProducts = await this.db
      .insert(ingredientsInProducts)
      .values(transformedIngredients)
      .returning();

    console.log({ newIngredientsInProducts });

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
    // console.log({ updateProduct });

    const {
      images,
      price,
      ingredients: ingredientsIds,
      ...props
    } = updateProduct;

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

    // console.log({ calculateDiscountPrice });

    const existingProductImages =
      await this.productImagesService.findImagesByProductId(productId);

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

    const existingIngredients = await this.db
      .select()
      .from(ingredients)
      .where(inArray(ingredients.id, ingredientsIds));

    const existingIngredientRelations = await this.db
      .select()
      .from(ingredientsInProducts)
      .where(eq(ingredientsInProducts.productId, productId));

    const transformedIngredients = existingIngredients.map((ingredient) => ({
      productId, //
      ingredientId: ingredient.id,
    }));

    // Filter out ingredients that are already related to the product
    const newIngredientRelations = transformedIngredients.filter(
      (newIngredient) =>
        !existingIngredientRelations.some(
          (existing) => existing.ingredientId === newIngredient.ingredientId
        )
    );

    // Insert only new ingredient relations
    if (newIngredientRelations.length > 0) {
      const updateIngredientsInProducts = await this.db
        .insert(ingredientsInProducts)
        .values(newIngredientRelations)
        .returning();

      console.log({ updateIngredientsInProducts });
    }

    // Remove old ingredients that are no longer in the update
    const ingredientsToRemove = existingIngredientRelations.filter(
      (existing) => !ingredientsIds.includes(existing.ingredientId)
    );

    if (ingredientsToRemove.length > 0) {
      await this.db.delete(ingredientsInProducts).where(
        inArray(
          ingredientsInProducts.ingredientId,
          ingredientsToRemove.map((ingredient) => ingredient.ingredientId)
        )
      );
    }

    const updateProductImages =
      await this.productImagesService.updateProductImages(
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

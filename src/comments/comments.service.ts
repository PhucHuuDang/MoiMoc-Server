import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import { InsertCommentProps, comment } from "src/drizzle/schema/comment.schema";
import { eq } from "drizzle-orm";
import { product } from "src/drizzle/schema/product.schema";
import { user } from "src/drizzle/schema/user.schema";
import { ProductsService } from "src/products/products.service";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDbType,

    //* these 2 way handle circular dependency
    // @Inject(forwardRef(() => ProductsService))
    @Inject(REQUEST)
    private readonly productService: ProductsService
  ) {}

  async addComment(addCommentValues: InsertCommentProps & { rating?: number }) {
    const existProduct = await this.productService.findDetailProduct(
      addCommentValues.productId
    );

    if (!existProduct) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }

    const insertComment = await this.db
      .insert(comment)
      .values(addCommentValues)
      .returning({ commentId: comment.id });

    return {
      message: "Comment added successfully",
      commentId: insertComment[0].commentId,
    };
  }

  async findAll() {
    const comments = await this.db.query.comment.findMany({
      with: {
        // product: true,
        user: true,
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      productId: comment.productId,
      // userId: comment.userId,
      // product: comment.product ? { ...comment.product } : undefined,
      user: comment.user ? { ...comment.user } : undefined,
    }));
  }

  async findDetailComment(id: number) {
    const getOneComment = await this.db
      .select({
        id: comment.id,
        content: comment.content,
        rating: comment.rating,
        createdAt: comment.createdAt,
        product: {
          productId: product.id,
          productName: product.productName,
          productDescription: product.productDescription,
          price: product.price,
          discountPrice: product.discountPrice,
          discountPercentage: product.discountPercentage,
          productTypeId: product.productTypeId,
        },
        user: {
          userId: user.id,
          username: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      })
      .from(comment)
      .leftJoin(product, eq(product.id, comment.productId))
      .leftJoin(user, eq(user.id, comment.userId))
      .where(eq(comment.id, id));

    const detailComment = getOneComment[0];

    return detailComment;
  }

  async findCommentByProductId(productId: number) {
    const comments = await this.db
      .select()
      .from(comment)
      .where(eq(comment.productId, productId));

    return comments;
  }

  async updateComment(id: number, updateCommentValues: InsertCommentProps) {
    const existProduct = await this.productService.findDetailProduct(
      updateCommentValues.productId
    );

    console.log({ id, existProduct });

    if (existProduct.productId !== updateCommentValues.productId) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }

    const updateComment = await this.db
      .update(comment)
      .set(updateCommentValues)
      .where(eq(comment.id, id))
      .returning();

    return {
      message: "Comment updated successfully",
      commentId: updateComment[0].id,
    };
  }

  async deleteComment(id: number) {
    return await this.db.delete(comment).where(eq(comment.id, id));
  }
}

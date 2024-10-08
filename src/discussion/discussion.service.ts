import { Inject, Injectable } from "@nestjs/common";
import { CreateDiscussionDto } from "./dto/create-discussion.dto";
import { UpdateDiscussionDto } from "./dto/update-discussion.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  InsertDiscussionTypes,
  discussion,
} from "src/drizzle/schema/discussion.schema";
import { eq } from "drizzle-orm";
import { user } from "src/drizzle/schema/user.schema";
import { product } from "src/drizzle/schema/product.schema";

@Injectable()
export class DiscussionService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async addDiscussion(
    discussionValues: InsertDiscussionTypes
  ): Promise<{ message: string }> {
    const newDiscussion = await this.db
      .insert(discussion)
      .values(discussionValues)
      .returning();

    return {
      message: `Created ${newDiscussion[0].content} successfully`,
    };
  }

  findAll() {
    return `This action returns all discussion`;
  }

  async findOneDiscussionById(discussionId: number): Promise<
    | {
        id: number;
        content: string;
        createdAt: string;
        user: {
          id: number;
          name: string;
          email: string;
          avatar: string;
        };
      }
    | { message: string }
  > {
    const discuss = await this.db
      .select({
        id: discussion.id,
        content: discussion.content,
        createdAt: discussion.createdAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      })
      .from(discussion)
      .leftJoin(user, eq(discussion.userId, user.id))
      .where(eq(discussion.id, discussionId));

    if (!discuss[0]) {
      return {
        message: "Discussion not found",
      };
    }

    return discuss[0];
  }

  update(discussionId: number, updateDiscussionValues: InsertDiscussionTypes) {
    return `This action updates a #${discussionId} discussion`;
  }

  remove(discussionId: number) {
    return `This action removes a #${discussionId} discussion`;
  }
}

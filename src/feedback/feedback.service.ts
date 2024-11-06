import { Inject, Injectable } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import {
  InsertFeedbackProps,
  feedback,
} from "src/drizzle/schema/feedback.schema";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";

@Injectable()
export class FeedbackService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async addFeedback(feedbackValues: InsertFeedbackProps) {
    try {
      const newFeedback = await this.db
        .insert(feedback)
        .values(feedbackValues)
        .returning();

      return {
        message: `Created ${newFeedback[0].content} successfully`,
      };
    } catch (error) {
      console.log({ error });
    }
  }

  async findFeedbacks() {
    try {
      const feedbacks = await this.db.query.feedback.findMany({
        with: {
          user: true,
        },
      });

      return feedbacks;
    } catch (error) {
      throw new Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}

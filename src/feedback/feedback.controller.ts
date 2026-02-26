import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
} from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { InsertFeedbackProps } from "src/drizzle/schema/feedback.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth/jwt-auth.guard";

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addFeedback(
    @Request() req: any,
    @Body() feedbackValues: InsertFeedbackProps,
  ) {
    const userId = req.user.id;

    const { content, productId, rating } = feedbackValues;

    if (!content || !productId || !rating) {
      throw new HttpException("Lack some fields for feedback", 400);
    }

    return this.feedbackService.addFeedback({ ...feedbackValues, userId });
  }

  @Get()
  findFeedbacks() {
    return this.feedbackService.findFeedbacks();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.feedbackService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateFeedbackDto: InsertFeedbackProps,
  ) {
    return this.feedbackService.update(+id, updateFeedbackDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.feedbackService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { InsertCommentProps } from "src/drizzle/schema/comment.schema";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  addComment(
    @Body() addCommentValues: InsertCommentProps & { rating?: number }
  ) {
    const { content, productId, userId } = addCommentValues;

    if (!content || !userId || !productId) {
      throw new HttpException(
        "Missing some values to add comment",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.commentsService.addComment(addCommentValues);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(":id")
  findOneComment(@Param("id") id: string) {
    return this.commentsService.findDetailComment(+id);
  }

  @Put(":id")
  updateComment(
    @Param("id") id: string,
    @Body() updateCommentValues: InsertCommentProps
  ) {
    if (!id) {
      throw new HttpException(
        "Missing id comment to update",
        HttpStatus.BAD_REQUEST
      );
    } else if (!updateCommentValues) {
      throw new HttpException(
        "Missing values to update",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.commentsService.updateComment(+id, updateCommentValues);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    if (!id) {
      throw new HttpException(
        "Missing id comment to delete",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.commentsService.deleteComment(+id);
  }
}

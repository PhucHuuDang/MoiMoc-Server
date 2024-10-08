import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpException,
} from "@nestjs/common";
import { DiscussionService } from "./discussion.service";
import { CreateDiscussionDto } from "./dto/create-discussion.dto";
import { UpdateDiscussionDto } from "./dto/update-discussion.dto";
import { InsertDiscussionTypes } from "src/drizzle/schema/discussion.schema";

@Controller("discussion")
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post()
  addDiscussion(@Body() discussionValues: InsertDiscussionTypes) {
    const { content, userId, productId } = discussionValues;

    if (!content || !userId || !productId) {
      throw new HttpException("Lack some fields for discussion", 400);
    }

    return this.discussionService.addDiscussion(discussionValues);
  }

  @Get()
  findAll() {
    return this.discussionService.findAll();
  }

  @Get(":discussionId")
  findOne(@Param("discussionId") discussionId: string) {
    if (!discussionId) {
      throw new HttpException("Invalid discussionId", 400);
    }

    return this.discussionService.findOneDiscussionById(+discussionId);
  }

  @Put(":discussionId")
  update(
    @Param("discussionId") discussionId: string,
    @Body() updateDiscussionDto: InsertDiscussionTypes
  ) {
    return this.discussionService.update(+discussionId, updateDiscussionDto);
  }

  @Delete(":discussionId")
  remove(@Param("discussionId") discussionId: string) {
    return this.discussionService.remove(+discussionId);
  }
}

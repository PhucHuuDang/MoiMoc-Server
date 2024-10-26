import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  BadRequestException,
} from "@nestjs/common";
import { AboutMoiMocService } from "./about-moi-moc.service";
import { AboutMoiMocInsertTypes } from "src/drizzle/schema/about-moi-moc.schema";

@Controller("about-moi-moc")
export class AboutMoiMocController {
  constructor(private readonly aboutMoiMocService: AboutMoiMocService) {}

  @Post()
  createContent(@Body() createContent: AboutMoiMocInsertTypes) {
    const { story, mission, vision } = createContent;

    if (!story || !mission || !vision) {
      throw new BadRequestException("story, mission, vision are required");
    }

    return this.aboutMoiMocService.createContentMoiMoc(createContent);
  }

  @Put()
  updateContent(@Body() updateContent: AboutMoiMocInsertTypes) {
    return this.aboutMoiMocService.updateContentMoiMoc(updateContent);
  }

  @Get()
  findAll() {
    return this.aboutMoiMocService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.aboutMoiMocService.findOne(+id);
  }
}

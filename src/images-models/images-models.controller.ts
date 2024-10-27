import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { ImagesModelsService } from "./images-models.service";
import { CreateImagesModelDto } from "./dto/create-images-model.dto";
import { UpdateImagesModelDto } from "./dto/update-images-model.dto";
import { ImagesModelsInsertTypes } from "src/drizzle/schema/images-models.schema";

@Controller("images-models")
export class ImagesModelsController {
  constructor(private readonly imagesModelsService: ImagesModelsService) {}

  @Post()
  addImages(@Body() imageUrls: ImagesModelsInsertTypes[]) {
    console.log({ imageUrls });
    return this.imagesModelsService.addImages(imageUrls);
  }

  @Get()
  findImagesModels() {
    return this.imagesModelsService.findImagesModels();
  }

  @Get(":imageId")
  findOne(@Param("imageId") imageId: string) {
    return this.imagesModelsService.findOne(+imageId);
  }

  @Put(":imageId")
  update(
    @Param("imageId") imageId: string,
    @Body() values: ImagesModelsInsertTypes
  ) {
    return this.imagesModelsService.replaceImage(+imageId, values);
  }

  @Delete(":imageId")
  deleteImage(@Param("imageId") imageId: string) {
    return this.imagesModelsService.deleteImage(+imageId);
  }
}

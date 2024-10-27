import { Module } from "@nestjs/common";
import { ImagesModelsService } from "./images-models.service";
import { ImagesModelsController } from "./images-models.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [ImagesModelsController],
  providers: [ImagesModelsService],
  imports: [DrizzleModule],
})
export class ImagesModelsModule {}

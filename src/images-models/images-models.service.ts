import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateImagesModelDto } from "./dto/create-images-model.dto";
import { UpdateImagesModelDto } from "./dto/update-images-model.dto";
import {
  ImagesModelsInsertTypes,
  imagesModelsSchema,
} from "src/drizzle/schema/images-models.schema";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import { and, eq } from "drizzle-orm";

@Injectable()
export class ImagesModelsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}
  async addImages(imageUrls: ImagesModelsInsertTypes[]) {
    try {
      const addImages = await this.db
        .insert(imagesModelsSchema)
        .values(imageUrls)
        .returning({ id: imagesModelsSchema.id });

      return {
        message: "Images added successfully",
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        "InternalServerErrorException when adding images models",
        {
          cause: new Error(error),
        }
      );
    }
  }

  async findImagesModels() {
    try {
      const images = await this.db.query.imagesModelsSchema.findMany();

      return images ?? [];
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        "InternalServerErrorException when finding images models",
        {
          cause: new Error(error),
        }
      );
    }
  }

  findOne(imageId: number) {
    return `This action returns a #${imageId} imagesModel`;
  }

  async replaceImage(imageId: number, values: ImagesModelsInsertTypes) {
    try {
      const existingImage = await this.db
        .select()
        .from(imagesModelsSchema)
        .where(eq(imagesModelsSchema.id, imageId));

      if (!existingImage[0]) throw new NotFoundException("Image not found");

      const updateImage = await this.db
        .update(imagesModelsSchema)
        .set(values)
        .where(
          and(
            eq(imagesModelsSchema.id, imageId),
            eq(imagesModelsSchema.aboutMoiMocId, values.aboutMoiMocId)
          )
        )
        .returning({ id: imagesModelsSchema.id });

      return {
        message: `Image has id ${updateImage[0].id} been updated successfully`,
      };
    } catch (error) {
      console.log({ error });

      throw new InternalServerErrorException(
        "InternalServerErrorException when replacing image",
        {
          cause: new Error(error),
        }
      );
    }
  }

  async deleteImage(imageId: number) {
    try {
      const existingImage = await this.db
        .select()
        .from(imagesModelsSchema)
        .where(eq(imagesModelsSchema.id, imageId));

      if (!existingImage[0]) throw new NotFoundException("Image not found");

      const deleteImage = await this.db
        .delete(imagesModelsSchema)
        .where(eq(imagesModelsSchema.id, imageId))
        .returning({ id: imagesModelsSchema.id });

      return {
        message: `Image has id ${deleteImage[0].id} been deleted successfully`,
      };
    } catch (error) {
      console.log({ error });

      throw new InternalServerErrorException(
        "InternalServerErrorException when replacing image",
        {
          cause: new Error(error),
        }
      );
    }
  }
}

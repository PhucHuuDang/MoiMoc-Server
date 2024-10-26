import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { SQL, eq } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import {
  AboutMoiMocInsertTypes,
  aboutMoiMocSchema,
} from "src/drizzle/schema/about-moi-moc.schema";
import {
  ImagesModelsInsertTypes,
  imagesModelsSchema,
} from "src/drizzle/schema/images-models.schema";
import { DrizzleDbType } from "types/drizzle";

@Injectable()
export class AboutMoiMocService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async createContentMoiMoc(updateContent: AboutMoiMocInsertTypes) {
    try {
      const result = await this.db
        .insert(aboutMoiMocSchema)
        .values(updateContent)
        .returning({ id: aboutMoiMocSchema.id });

      return {
        message: "Created content for About Moi Moc successfully",
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        "InternalServerErrorException when creating content moi moc"
      );
    }
  }

  async updateContentMoiMoc(updateContent: AboutMoiMocInsertTypes) {
    try {
      const result = await this.db
        .update(aboutMoiMocSchema)
        .set(updateContent)
        .where(eq(aboutMoiMocSchema.id, 1))
        .returning({ id: aboutMoiMocSchema.id });

      return {
        message: "Update successfully",
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        "InternalServerErrorException when updating content moi moc"
      );
    }
  }

  async addImagesModels(imageUrl: ImagesModelsInsertTypes[]) {
    try {
      const result = await this.db
        .insert(imagesModelsSchema)
        .values(imageUrl)
        .returning({ id: imagesModelsSchema.id });

      return {
        message: "Insert successfully",
      };
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        "InternalServerErrorException when adding images models"
      );
    }
  }

  findAll() {
    return `This action returns all aboutMoiMoc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aboutMoiMoc`;
  }

  update(id: number, updateAboutMoiMocDto: AboutMoiMocInsertTypes) {
    return `This action updates a #${id} aboutMoiMoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} aboutMoiMoc`;
  }
}

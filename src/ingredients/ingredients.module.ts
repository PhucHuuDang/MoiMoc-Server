import { Module } from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { IngredientsController } from "./ingredients.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [DrizzleModule],
})
export class IngredientsModule {}

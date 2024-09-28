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
  HttpStatus,
} from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { InsertIngredientsValues } from "src/drizzle/schema/ingredients.schema";

@Controller("ingredients")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  createIngredient(@Body() createIngredientValues: InsertIngredientsValues) {
    if (!createIngredientValues) {
      throw new HttpException(
        "Create ingredient values are required",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.ingredientsService.createIngredient(createIngredientValues);
  }

  @Get()
  findAllIngredients() {
    return this.ingredientsService.findAllIngredients();
  }

  @Get(":ingredientId")
  findIngredient(@Param("ingredientId") ingredientId: string) {
    return this.ingredientsService.findIngredient(+ingredientId);
  }

  @Put(":ingredientId")
  updateIngredient(
    @Param("ingredientId") ingredientId: string,
    @Body() updateIngredientValues: InsertIngredientsValues
  ) {
    if (!ingredientId || !updateIngredientValues) {
      throw new HttpException(
        "ID and update values are required",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.ingredientsService.updateIngredient(
      +ingredientId,
      updateIngredientValues
    );
  }

  @Delete(":ingredientId")
  deleteIngredient(@Param("ingredientId") ingredientId: string) {
    if (!ingredientId) {
      throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);
    }

    return this.ingredientsService.deleteIngredient(+ingredientId);
  }
}

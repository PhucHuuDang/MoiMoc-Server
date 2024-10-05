import { ingredientsInProducts } from "./../drizzle/schema/ingredients-in-products.schema";
import { Inject, Injectable } from "@nestjs/common";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { DrizzleDbType } from "types/drizzle";
import {
  InsertIngredientsValues,
  SelectIngredientValues,
  ingredients,
} from "src/drizzle/schema/ingredients.schema";
import { and, eq } from "drizzle-orm";

@Injectable()
export class IngredientsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {}

  async createIngredient(
    createIngredientValues: InsertIngredientsValues
  ): Promise<{ message: string; ingredient: string }> {
    const newIngredient = await this.db
      .insert(ingredients)
      .values(createIngredientValues)
      .returning();

    return {
      message: `Created ${newIngredient[0].ingredient} successfully`,
      ingredient: newIngredient[0].ingredient,
    };
  }

  async findAllIngredients(): Promise<SelectIngredientValues[]> {
    const selectAllIngredients = await this.db.query.ingredients.findMany({
      columns: {
        id: true,
        ingredient: true,
        createdAt: true,
        updatedAt: true,
        // ingredientsInProducts: true,
      },
    });

    return selectAllIngredients;
  }

  async findIngredient(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  async updateIngredient(
    ingredientId: number,
    updateIngredientValues: InsertIngredientsValues & { productId: number }
  ): Promise<{ message: string; ingredient: string }> {
    const updatedIngredient = await this.db
      .update(ingredients)
      .set(updateIngredientValues)
      .where(and(eq(ingredients.id, ingredientId)))
      .returning();

    return {
      message: `Updated '${updatedIngredient[0].ingredient}' successfully`,
      ingredient: updatedIngredient[0].ingredient,
    };
  }

  async deleteIngredient(ingredientId: number) {
    const deletedIngredient = await this.db
      .delete(ingredients)
      .where(eq(ingredients.id, ingredientId))
      .returning();

    return {
      message: `Deleted '${deletedIngredient[0].ingredient}' successfully`,
      ingredient: deletedIngredient[0].ingredient,
    };
  }
}

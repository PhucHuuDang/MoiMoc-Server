import { integer, pgTable, primaryKey, serial } from "drizzle-orm/pg-core";
import { product } from "./product.schema";
import { ingredients } from "./ingredients.schema";
import { relations } from "drizzle-orm";

export const ingredientsInProducts = pgTable(
  "ingredients_in_products",
  {
    // id: serial("id").primaryKey(),

    productId: integer("productId")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    ingredientId: integer("ingredientId")
      .notNull()
      .references(() => ingredients.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.ingredientId] }),
  })
);

export const ingredientsInProductsRelations = relations(
  ingredientsInProducts,
  ({ one, many }) => ({
    product: one(product, {
      fields: [ingredientsInProducts.productId],
      references: [product.id],
    }),
    ingredient: one(ingredients, {
      fields: [ingredientsInProducts.ingredientId],
      references: [ingredients.id],
    }),
  })
);

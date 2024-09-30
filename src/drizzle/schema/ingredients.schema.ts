import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { product } from "./product.schema";

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  ingredient: varchar("ingredient", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull().defaultNow(),

  productId: integer("productId").references(() => product.id, {
    onDelete: "cascade",
  }),
});

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  product: one(product, {
    fields: [ingredients.productId],
    references: [product.id],
  }),
}));

export type InsertIngredientsValues = InferInsertModel<typeof ingredients>;
export type SelectIngredientValues = InferSelectModel<typeof ingredients>;

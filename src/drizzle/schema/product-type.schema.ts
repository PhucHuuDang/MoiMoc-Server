import { InferSelectModel, relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { product } from './product.schema';

export const productType = pgTable('productType', {
  id: serial('id').primaryKey(),
  type: text('name').notNull(),
});

export const productTypeRelations = relations(productType, ({ one }) => ({
  product: one(product),
}));

export type InsertProductTypeProps = typeof productType.$inferInsert;
export type SelectProductTypeProps = InferSelectModel<typeof productType>;

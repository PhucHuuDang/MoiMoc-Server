import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  numeric,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';

export const custom = pgTable('custom', {
  id: serial('id').primaryKey(),
  option: text('options').notNull(),
  price: numeric('price', { precision: 15, scale: 0 }).notNull(),

  productId: integer('productId')
    .references(() => product.id)
    .default(undefined),
});

export const customRelations = relations(custom, ({ one, many }) => ({
  product: one(product, {
    fields: [custom.productId],
    references: [product.id],
  }),
}));

import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

import { InferInsertModel, relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { comment } from './comment.schema';
import { orderDetailSchema } from './order-detail.schema';
import { custom } from './custom.schema';
import { productImages } from './product-images.schema';
import { productType } from './product-type.schema';

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  productName: varchar('productName', { length: 255 }).notNull(),
  productDescription: text('productDescription').notNull(),
  price: numeric('price', { precision: 15, scale: 0 }).notNull(),

  discountPrice: numeric('discountPrice', { precision: 15, scale: 0 }).default(
    undefined,
  ),
  discountPercentage: numeric('discountPercentage').default(undefined),
  quantity: numeric('quantity').notNull(),

  productTypeId: integer('productTypeId')
    .references(() => productType.id, { onDelete: 'cascade' })
    .notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  productImages: many(productImages),
  productType: one(productType),
  comments: many(comment),
  orderDetail: one(orderDetailSchema),
  custom: many(custom),
}));

export const productZod = createInsertSchema(product);

export type ProductShapeType = InferInsertModel<typeof product>;

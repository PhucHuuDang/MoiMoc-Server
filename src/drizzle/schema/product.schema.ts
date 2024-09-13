import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  numeric,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import { comment } from './comment.schema';
import { orderDetailSchema } from './order-detail.schema';
import { custom } from './custom.schema';
import { productImages } from './product-images.schema';
import { productType } from './product-type.schema';

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  productName: text('productName').notNull(),
  productDescription: text('productDescription').notNull(),
  price: numeric('price', { precision: 15, scale: 0 }).notNull(),

  discountPrice: numeric('discountPrice', { precision: 15, scale: 0 }).default(
    undefined,
  ),
  discountPercentage: numeric('discountPercentage').default(undefined),
  quantity: numeric('quantity').notNull(),

  orderDetailId: integer('orderDetailId')
    .references(() => orderDetailSchema.id)
    .default(undefined),

  productTypeId: integer('productTypeId')
    .references(() => productType.id)
    .notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  productImages: many(productImages),
  productType: one(productType),
  comments: many(comment),
  orderDetail: one(orderDetailSchema, {
    fields: [product.orderDetailId],
    references: [orderDetailSchema.id],
  }),
  custom: many(custom),
}));

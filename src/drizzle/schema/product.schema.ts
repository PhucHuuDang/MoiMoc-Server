import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { comment } from './comment.schema';
import { orderDetailSchema } from './order-detail.schema';
import { custom } from './custom.schema';
import { productImages } from './product-images.schema';
import { productType } from './product-type.schema';

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  productName: text('product_name').notNull(),
  productDescription: text('productDescription').notNull(),
  price: numeric('price').notNull(),
  discountPrice: numeric('discountPrice').default(undefined),
  discountPercentage: numeric('discountPercentage').default(undefined),
  rating: numeric('rating').default(undefined),
  quantity: numeric('stock').notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  productImages: many(productImages),
  productType: one(productType),
  comments: many(comment),
  orderDetail: one(orderDetailSchema),
  custom: many(custom),
}));

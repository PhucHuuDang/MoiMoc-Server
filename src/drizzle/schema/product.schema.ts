import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core';

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
}));

const productImages = pgTable('productImages', {
  id: serial('id').primaryKey(),
  imageUrl: text('imageUrl').notNull(),
  productId: integer('productId').references(() => product.id),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  productImages: one(product, {
    fields: [productImages.productId],
    references: [product.id],
  }),
}));

export const productType = pgTable('productType', {
  id: serial('id').primaryKey(),
  type: text('name').notNull(),
});

export const productTypeRelations = relations(productType, ({ one }) => ({
  product: one(product, {
    fields: [productType.id],
    references: [product.id],
  }),
}));

import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { user } from './user.schema';
import { product } from './product.schema';

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  rating: numeric('rating').default(undefined),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
  userId: integer('userId')
    .references(() => user.id)
    .notNull(),

  productId: integer('productId')
    .references(() => product.id)
    .notNull(),
});

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: many(user),
  product: one(product, {
    fields: [comment.productId],
    references: [product.id],
  }),
}));

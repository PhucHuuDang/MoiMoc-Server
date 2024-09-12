import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { user } from './user.schema';
import { product } from './product.schema';

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  userId: integer('userId').references(() => user.id),

  productId: integer('productId').references(() => product.id),
});

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: many(user),
  product: one(product, {
    fields: [comment.productId],
    references: [product.id],
  }),
}));

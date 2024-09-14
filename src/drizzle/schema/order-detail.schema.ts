import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { relations } from 'drizzle-orm';
import { product } from './product.schema';
import { paymentHistory } from './payment-history.schema';

export const orderDetailSchema = pgTable('orderDetail', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => user.id),
  paymentHistoryId: integer('paymentHistoryId').references(
    () => paymentHistory.id,
    { onDelete: 'cascade' },
  ),

  productId: integer('productId')
    .notNull()
    .references(() => product.id)
    .notNull(),

  useId: integer('userId')
    .references(() => user.id)
    .notNull(),

  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const orderDetailRelations = relations(
  orderDetailSchema,
  ({ one, many }) => ({
    user: one(user, {
      fields: [orderDetailSchema.userId],
      references: [user.id],
    }),
    product: many(product),
    paymentHistory: one(paymentHistory, {
      fields: [orderDetailSchema.id],
      references: [paymentHistory.id],
    }),
  }),
);

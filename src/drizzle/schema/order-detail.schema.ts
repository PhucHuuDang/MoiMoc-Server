import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
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
  ),
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

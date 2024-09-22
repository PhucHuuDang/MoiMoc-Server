import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { orderDetailSchema } from './order-detail.schema';

export const paymentHistory = pgTable('paymentHistory', {
  id: serial('id').primaryKey(),
  orderDetailId: integer('orderDetailId')
    .references(() => orderDetailSchema.id)
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).defaultNow(),
});

export const paymentHistoryRelations = relations(
  paymentHistory,
  ({ one, many }) => ({
    orderDetail: one(orderDetailSchema, {
      fields: [paymentHistory.orderDetailId],
      references: [orderDetailSchema.id],
    }),
  }),
);

export type PaymentHistoryProps = InferInsertModel<typeof paymentHistory>;
export type SelectPaymentHistoryProps = InferSelectModel<typeof paymentHistory>;

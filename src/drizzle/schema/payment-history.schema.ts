import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { orderDetailSchema } from './order-detail.schema';

export const paymentHistory = pgTable('paymentHistory', {
  id: serial('id').primaryKey(),
  orderDetailId: integer('orderDetailId').notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).defaultNow(),
});

export const paymentHistoryRelations = relations(
  paymentHistory,
  ({ one, many }) => ({
    orderDetail: one(orderDetailSchema),
  }),
);

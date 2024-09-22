import {
  decimal,
  integer,
  numeric,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import { orderDetailSchema } from './order-detail.schema';
import { InferInsertModel, relations } from 'drizzle-orm';

export const paymentMethod = pgTable('paymentMethod', {
  id: serial('id').primaryKey(),
  method: text('method').notNull(),
  price: numeric('price', { precision: 15, scale: 0 }).notNull(),

  // orderDetailId: integer('orderDetailId')
  //   .references(() => orderDetailSchema.id)
  //   .notNull(),
});

export const paymentMethodRelations = relations(paymentMethod, ({ one }) => ({
  orderDetail: one(orderDetailSchema),
}));

export type PaymentMethodProps = InferInsertModel<typeof paymentMethod>;

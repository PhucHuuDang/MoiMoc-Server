import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { orderDetailSchema } from './order-detail.schema';

export const delivery = pgTable('deliveryMethod', {
  id: serial('id').primaryKey(),
  method: text('method').notNull(),
  price: numeric('price').notNull(),

  orderDetailId: integer('orderDetailId')
    .references(() => orderDetailSchema.id)
    .notNull(),
});

export const deliveryRelations = relations(delivery, ({ one }) => ({
  orderDetail: one(orderDetailSchema, {
    fields: [delivery.orderDetailId],
    references: [orderDetailSchema.id],
  }),
}));

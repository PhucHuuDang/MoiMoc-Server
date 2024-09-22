import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { relations } from 'drizzle-orm';
import { product } from './product.schema';
import { paymentHistory } from './payment-history.schema';
import { paymentMethod } from './payment-method.schema';
import { orderProducts } from './order-products';
import { delivery } from './delivery-method.schema';

export const orderDetailSchema = pgTable('orderDetail', {
  id: serial('id').primaryKey(),

  userId: integer('userId')
    .notNull()
    .references(() => user.id),

  // paymentHistoryId: integer('paymentHistoryId').references(
  //   () => paymentHistory.id,
  //   { onDelete: 'cascade' },
  // ),

  paymentMethodId: integer('paymentMethod')
    .references(() => paymentMethod.id)
    .notNull(),

  deliveryMethodId: integer('deliveryMethodId')
    .references(() => delivery.id)
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
    // product: many(product),
    orderProducts: many(orderProducts),

    deliveryMethod: one(delivery, {
      fields: [orderDetailSchema.deliveryMethodId],
      references: [delivery.id],
    }),

    // paymentHistory: one(paymentHistory, {
    //   fields: [orderDetailSchema.id],
    //   references: [paymentHistory.id],
    // }),

    paymentMethod: one(paymentMethod, {
      fields: [orderDetailSchema.paymentMethodId],
      references: [paymentMethod.id],
    }),
  }),
);

export type OrderDetailProps = typeof orderDetailSchema.$inferInsert;

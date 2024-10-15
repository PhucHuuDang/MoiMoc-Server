import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { relations } from "drizzle-orm";
import { product } from "./product.schema";
import { paymentHistory } from "./payment-history.schema";
import { paymentMethod } from "./payment-method.schema";
import { orderProducts } from "./order-products";
import { delivery } from "./delivery-method.schema";
import { subscription } from "./subscription.schema";
import { usersOrders } from "./users-orders.schema";

export const orderDetailSchema = pgTable("orderDetail", {
  id: serial("id").primaryKey(),

  // userId: integer("userId")
  //   .notNull()
  //   .references(() => user.id),

  paymentMethodId: integer("paymentMethodId")
    .references(() => paymentMethod.id)
    .notNull(),

  deliveryMethodId: integer("deliveryMethodId")
    .references(() => delivery.id)
    .notNull(),

  totalAmount: integer("totalAmount").notNull(),

  discountCode: text("discountCode"),

  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull().defaultNow(),
});

export const orderDetailRelations = relations(
  orderDetailSchema,
  ({ one, many }) => ({
    // user: one(user, {
    //   fields: [orderDetailSchema.userId],
    //   references: [user.id],
    // }),

    usersOrders: many(usersOrders),

    orderProducts: many(orderProducts),

    deliveryMethod: one(delivery, {
      fields: [orderDetailSchema.deliveryMethodId],
      references: [delivery.id],
    }),

    paymentMethod: one(paymentMethod, {
      fields: [orderDetailSchema.paymentMethodId],
      references: [paymentMethod.id],
    }),

    // subscription: one(subscription),
  })
);

export type OrderDetailProps = typeof orderDetailSchema.$inferInsert;

export type OrderDetailSelectTypes = typeof orderDetailSchema.$inferSelect;

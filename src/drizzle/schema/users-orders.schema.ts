import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { orderDetailSchema } from "./order-detail.schema";
import { InferInsertModel, relations } from "drizzle-orm";

export const usersOrders = pgTable(
  "users_orders",
  {
    userId: integer("userId")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    orderDetailId: integer("orderDetailId")
      .notNull()
      .references(() => orderDetailSchema.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.orderDetailId] }),
  })
);

export const usersOrdersRelations = relations(usersOrders, ({ one, many }) => ({
  user: one(user, {
    fields: [usersOrders.userId],
    references: [user.id],
  }),
  orderDetail: one(orderDetailSchema, {
    fields: [usersOrders.orderDetailId],
    references: [orderDetailSchema.id],
  }),
}));

export type UserOrdersInsert = InferInsertModel<typeof usersOrders>;

import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  numeric,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { orderDetailSchema } from "./order-detail.schema";

export const delivery = pgTable("deliveryMethod", {
  id: serial("id").primaryKey(),
  method: text("method").notNull(),
  // price: numeric('price').notNull(),
  price: numeric("price", { precision: 15, scale: 0 }).notNull(),
  active: boolean("active").notNull().default(true),
  estimatedDays: text("estimatedDays").notNull(),
  ordersLastMonth: numeric("ordersLastMonth"),
  revenue: numeric("revenue"),
});

export const deliveryRelations = relations(delivery, ({ one }) => ({
  orderDetail: one(orderDetailSchema),
}));

export type DeliveryInsertTypes = InferInsertModel<typeof delivery>;
export type DeliverySelectTypes = InferSelectModel<typeof delivery>;

import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { orderDetailSchema } from "./order-detail.schema";

export const subscription = pgTable("subscription", {
  id: serial("id").primaryKey().notNull(),

  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).notNull(),

  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  }).notNull(),

  stripPriceId: varchar("stripe_price_id", { length: 255 }).notNull(),

  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", {
    mode: "string",
  }).notNull(),

  orderDetailId: integer("orderDetailId")
    .references(() => orderDetailSchema.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),

  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
});

export const subscriptionRelations = relations(
  subscription,
  ({ one, many }) => ({
    orderDetail: one(orderDetailSchema, {
      fields: [subscription.orderDetailId],
      references: [orderDetailSchema.id],
    }),
  })
);

export type SubscriptionInsertTypes = typeof subscription.$inferInsert;
export type SubscriptionSelectTypes = typeof subscription.$inferSelect;

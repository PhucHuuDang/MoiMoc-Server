import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { InferInsertModel, relations } from "drizzle-orm";

import { user } from "./user.schema";
import { product } from "./product.schema";

export const discussion = pgTable("discussion", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),

  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull().defaultNow(),

  userId: integer("userId")
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),

  productId: integer("productId")
    .references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

export const discussionRelations = relations(discussion, ({ one, many }) => ({
  user: one(user, {
    fields: [discussion.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [discussion.productId],
    references: [product.id],
  }),
}));

export type InsertDiscussionTypes = InferInsertModel<typeof discussion>;
export type SelectDiscussionProps = InferInsertModel<typeof discussion>;

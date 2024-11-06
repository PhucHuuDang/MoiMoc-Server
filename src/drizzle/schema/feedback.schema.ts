import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { product } from "./product.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => user.id)
    .notNull(),
  productId: integer("productId")
    .references(() => product.id)
    .notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull().defaultNow(),
});

export const feedbackRelations = relations(feedback, ({ one, many }) => ({
  user: one(user, {
    fields: [feedback.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [feedback.productId],
    references: [product.id],
  }),
}));

export type InsertFeedbackProps = InferInsertModel<typeof feedback>;

export type SelectFeedbackProps = InferSelectModel<typeof feedback>;

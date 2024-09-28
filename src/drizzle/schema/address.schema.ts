import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { InferInsertModel, relations } from "drizzle-orm";

export const address = pgTable("address", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  createdAat: timestamp("createdAt").defaultNow(),
  updatedAat: timestamp("updatedAt").defaultNow(),
  userId: integer("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
});

export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
}));

export type InsertAddressProps = InferInsertModel<typeof address>;
export type SelectAddressProps = InferInsertModel<typeof address>;

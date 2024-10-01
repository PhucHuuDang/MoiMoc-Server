import { z } from "zod";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { isValidPhone } from "../../regex-validation/phone-validation";

export const phones = pgTable("phones", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).defaultNow(),

  userId: integer("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
});

export const phonesRelations = relations(phones, ({ one }) => ({
  user: one(user, {
    fields: [phones.userId],
    references: [user.id],
  }),
}));

export const phonesZod = createInsertSchema(phones, {
  phone: (schema) =>
    schema.phone
      .min(10, {
        message: "Phone number must be at least 10 characters long",
      })
      .max(15, {
        message: "Phone number must be at most 15 characters long",
      })
      .refine(isValidPhone, {
        message: "Phone number is not valid",
      }),
});

type PhoneTypes = z.infer<typeof phonesZod>;
export type PhoneInsertTypes = InferInsertModel<typeof phones>;
export type PhoneSelectTypes = InferSelectModel<typeof phones>;

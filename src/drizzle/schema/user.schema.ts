import { InferSelectModel, relations } from "drizzle-orm";
import { z } from "zod";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { phones } from "./phones.schema";
import { address } from "./address.schema";
import { comment } from "./comment.schema";
import { createInsertSchema } from "drizzle-zod";
import { feedback } from "./feedback.schema";

export const userRole = pgEnum("role", ["ADMIN", "STAFF", "MEMBER"]);

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  role: userRole("role").default("MEMBER"),
  password: varchar("password", { length: 255 }).notNull(),
  phoneAuth: varchar("phoneAuth", { length: 12 }).notNull().unique(),
  avatar: text("avatar"),

  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).defaultNow(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  phones: many(phones),
  address: many(address),
  comments: many(comment),
  feedbacks: many(feedback),
}));

export const userZod = createInsertSchema(user, {
  email: (schema) =>
    schema.email
      .email()
      .min(5, {
        message: "Email must be at least 5 characters long",
      })
      .max(100, {
        message: "Email must be at most 100 characters long",
      }),
});

export type NewUser = typeof user.$inferInsert & {
  phoneNumber?: string;
  email?: string;
};

export type UserSelectTypes = InferSelectModel<typeof user>;

// export type UserShapeType = z.infer<typeof userZod>;
// export type UserShapeType = InferSelectModel<typeof user>;

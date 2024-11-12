import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const activityUser = pgTable("activity_user", {
  id: serial("id").primaryKey(),
  activity: varchar("activity", { length: 255 }).notNull(),

  userId: integer("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),

  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

export const activityUserRelations = relations(
  activityUser,
  ({ one, many }) => ({
    user: one(user, {
      fields: [activityUser.userId],
      references: [user.id],
    }),
  })
);

export type ActivityUserInsert = InferInsertModel<typeof activityUser>;

export type ActivityUserSelects = InferSelectModel<typeof activityUser>;

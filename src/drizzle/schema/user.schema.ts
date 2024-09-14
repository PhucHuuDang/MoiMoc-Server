import { InferSelectModel, relations } from 'drizzle-orm';
import { z } from 'zod';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { phone } from './phone.schema';
import { address } from './address.schema';
import { comment } from './comment.schema';
import { createInsertSchema } from 'drizzle-zod';

export const userRole = pgEnum('role', ['ADMIN', 'STAFF', 'MEMBER']);

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  // phone: text('phone').notNull(),
  role: userRole('role').default('MEMBER'),
  // created_at: timestamp('created_at').defaultNow(),
  // updated_at: timestamp('updated_at').defaultNow(),

  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).defaultNow(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  phone: many(phone),
  address: many(address),
  comments: many(comment),
}));

export const userZod = createInsertSchema(user).extend({
  name: z.string().min(5, 'Name is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  phone: z.string().min(10, 'Phone is required'),
  role: z.enum(['ADMIN', 'STAFF', 'MEMBER']).optional(),
});
export type NewUser = typeof user.$inferInsert;

// export type UserShapeType = z.infer<typeof userZod>;
// export type UserShapeType = InferSelectModel<typeof user>;
// export const phone = pgTable('phone', {
//   id: serial('id ').primaryKey(),
//   phone: text('phone').notNull(),
//   created_at: timestamp('created_at').defaultNow(),
//   updated_at: timestamp('updated_at').defaultNow(),
//   userId: integer('userId').references(() => user.id),
// });

// export const address = pgTable('address', {
//   address: text('address').notNull(),
//   created_at: timestamp('created_at').defaultNow(),
//   updated_at: timestamp('updated_at').defaultNow(),
//   userId: integer('userId').references(() => user.id),
// });

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
  role: userRole('role').default('MEMBER'),
  password: varchar('password', { length: 255 }).notNull(),

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

export type NewUser = typeof user.$inferInsert & {
  phoneNumber: string;
};

// export type UserShapeType = z.infer<typeof userZod>;
// export type UserShapeType = InferSelectModel<typeof user>;

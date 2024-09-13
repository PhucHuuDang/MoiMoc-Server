import { relations } from 'drizzle-orm';
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

export const userRole = pgEnum('role', ['ADMIN', 'STAFF', 'MEMBER']);

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: text('phone').notNull(),
  role: userRole('role').default('MEMBER'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  phone: many(phone),
  address: many(address),
  comments: many(comment),
}));
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

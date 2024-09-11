import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { phone } from './phone.schema';
import { address } from './address.schema';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  phone: many(phone),
  address: many(address),
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

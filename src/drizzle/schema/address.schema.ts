import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { relations } from 'drizzle-orm';

export const address = pgTable('address', {
  address: text('address').notNull(),
  createdAat: timestamp('createdAt').defaultNow(),
  updatedAat: timestamp('updatedAt').defaultNow(),
  userId: integer('userId')
    .references(() => user.id)
    .notNull(),
});

export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
}));

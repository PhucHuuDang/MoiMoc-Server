import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { relations } from 'drizzle-orm';

export const oderDetail = pgTable('orderDetail', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => user.id),
});

export const orderDetailRelations = relations(oderDetail, ({ one }) => ({
  user: one(user, {
    fields: [oderDetail.userId],
    references: [user.id],
  }),
}));

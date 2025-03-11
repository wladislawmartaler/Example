import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

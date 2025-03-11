import { pgTable, integer, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const ordersTable = pgTable('orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

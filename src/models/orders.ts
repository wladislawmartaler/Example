import { pgTable, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { createInsertSchema } from 'drizzle-zod';

export const status_enum = pgEnum('status_enum', [
  'pending',
  'shipped',
  'delivered',
  'cancelled',
]);

export const ordersTable = pgTable('orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: status_enum().notNull().default('pending'),
});

export type Order = typeof ordersTable.$inferSelect;
export type NewOrder = typeof ordersTable.$inferInsert;

export const NewOrderSchema = createInsertSchema(ordersTable);

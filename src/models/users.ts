import { pgTable, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('customer'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phoneNumber: text('phone_number'),
  isVIP: boolean('is_vip').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

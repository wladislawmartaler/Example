import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const addressesTable = pgTable('addresses', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  zipCode: text('zip_code').notNull(),
  country: text('country').notNull()
});

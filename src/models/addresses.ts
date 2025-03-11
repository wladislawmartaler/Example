import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const addressesTable = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(), // Verknüpfung zum User
  street: text('street').notNull(),
  city: text('city').notNull(),
  zipCode: text('zip_code').notNull(),
  country: text('country').notNull()
});

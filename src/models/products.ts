import { pgTable, serial, text, integer, numeric } from 'drizzle-orm/pg-core';

export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0), // Lagerbestand
});

import { pgTable, text, integer, numeric, pgEnum } from 'drizzle-orm/pg-core';

export const category_enum = pgEnum('category_enum', [
  'Uncategorized',
  'Food',
  'Clothing',
  'Electronics',
  'Home',
  'Beauty & Health',
  'Gifts',
]);

export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  category: category_enum().notNull().default("Uncategorized")
});

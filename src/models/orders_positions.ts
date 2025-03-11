import { pgTable, integer } from 'drizzle-orm/pg-core';
import { ordersTable } from './orders';
import { productsTable } from './products';

export const ordersPositionsTable = pgTable('order_positions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').references(() => ordersTable.id).notNull(),
  productId: integer('product_id').references(() => productsTable.id).notNull(),
  quantity: integer('quantity').notNull(),
});

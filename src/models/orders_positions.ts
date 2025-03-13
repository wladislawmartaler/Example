import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { ordersTable } from './orders';
import { productsTable } from './products';
import { createInsertSchema } from 'drizzle-zod';

export const ordersPositionsTable = pgTable('order_positions', {
  orderId: integer('order_id').references(() => ordersTable.id).notNull(),
  productId: integer('product_id').references(() => productsTable.id).notNull(),
  quantity: integer('quantity').notNull(),
  }, (table) => [primaryKey({ columns: [table.orderId, table.productId] })]
);

export type OrderPosition = typeof ordersPositionsTable.$inferSelect;
export type NewOrderPosition = typeof ordersPositionsTable.$inferInsert;

export const NewOrderPositionSchema = createInsertSchema(ordersPositionsTable);

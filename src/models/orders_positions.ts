import { pgTable, serial, integer } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { products } from './products';

export const orderPositions = pgTable('order_positions', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
});

import { relations } from 'drizzle-orm';
import { usersTable } from '../models/users';
import { addressesTable } from '../models/addresses';
import { ordersTable, status_enum } from '../models/orders';
import { productsTable, category_enum } from '../models/products';
import { ordersPositionsTable } from '../models/orders_positions';

// # Drizzle - Relationen

// ## User-Relationen - 1:N mit Orders - 1:N mit Addresses
export const userRelations = relations(usersTable, ({ many }) => ({
  orders: many(ordersTable),
  addresses: many(addressesTable),
}));

// ## Address-Relationen - N:1 mit Users
export const addressRelations = relations(addressesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [addressesTable.userId],
    references: [usersTable.id],
    relationName: 'user_to_address',
  }),
}));

// ## Order-Relationen - 1:N mit OrderPositions - N:1 mit User
export const orderRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  orderPositions: many(ordersPositionsTable),
}));

// ## Product-Relationen - N:M mit OrderPositions
export const productRelations = relations(productsTable, ({ many }) => ({
  orderPositions: many(ordersPositionsTable),
}));

// ## OrderPositions-Relationen - N:1 zu Orders & Products
export const orderPositionsRelations = relations(ordersPositionsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [ordersPositionsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [ordersPositionsTable.productId],
    references: [productsTable.id],
  }),
}));

export {
  usersTable,
  addressesTable,
  ordersTable,
  productsTable,
  ordersPositionsTable,
  status_enum,
  category_enum,
};

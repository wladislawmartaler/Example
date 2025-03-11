import { Hono } from 'hono';
import { db } from '../db/config';
import { ordersTable, ordersPositionsTable, productsTable } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const ordersRouter = new Hono();

// 📌 Alle Bestellungen eines Users abrufen (GET /users/:id/orders)
ordersRouter.get('/:id/orders', async (c) => {
  const userId = Number(c.req.param('id'));
  try {
    const userOrders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId));

    return c.json(userOrders);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen der Bestellungen' }, 500);
  }
});

// 📌 Neue Bestellung für einen User anlegen (POST /users/:id/orders)
ordersRouter.post('/:id/orders', async (c) => {
  const userId = Number(c.req.param('id'));
  try {
    const newOrder = await db.insert(ordersTable).values({ userId }).returning();
    return c.json(newOrder[0], 201);
  } catch (error) {
    return c.json({ error: 'Fehler beim Erstellen der Bestellung' }, 500);
  }
});

// 📌 Einzelne Bestellung abrufen mit Produkten (GET /users/:userId/orders/:orderId)
ordersRouter.get('/:userId/orders/:orderId', async (c) => {
  const orderId = Number(c.req.param('orderId'));
  try {
    const orderDetails = await db
      .select({
        orderId: ordersTable.id,
        createdAt: ordersTable.createdAt,
        productId: ordersPositionsTable.productId,
        quantity: ordersPositionsTable.quantity,
        productName: productsTable.name,
        price: productsTable.price,
      })
      .from(ordersTable)
      .leftJoin(ordersPositionsTable, eq(ordersPositionsTable.orderId, ordersTable.id))
      .leftJoin(productsTable, eq(ordersPositionsTable.productId, productsTable.id))
      .where(eq(ordersTable.id, orderId));

    if (!orderDetails.length) {
      return c.json({ error: 'Bestellung nicht gefunden oder keine Produkte enthalten' }, 404);
    }

    return c.json(orderDetails);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen der Bestellung' }, 500);
  }
});

// 📌 Produkt zu einer Bestellung hinzufügen (POST /users/:userId/orders/:orderId/products)
ordersRouter.post('/:userId/orders/:orderId/products', async (c) => {
  const orderId = Number(c.req.param('orderId'));
  try {
    const body = await c.req.json();
    const newOrderPosition = await db
      .insert(ordersPositionsTable)
      .values({
        orderId,
        productId: body.productId,
        quantity: body.quantity,
      })
      .returning();

    return c.json(newOrderPosition[0], 201);
  } catch (error) {
    return c.json({ error: 'Fehler beim Hinzufügen des Produkts zur Bestellung' }, 500);
  }
});

// 📌 Produkt aus einer Bestellung entfernen (DELETE /users/:userId/orders/:orderId/products/:productId)
ordersRouter.delete('/:userId/orders/:orderId/products/:productId', async (c) => {
  const orderId = Number(c.req.param('orderId'));
  const productId = Number(c.req.param('productId'));
  try {
    const deletedItem = await db
      .delete(ordersPositionsTable)
      .where(and(eq(ordersPositionsTable.orderId, orderId), eq(ordersPositionsTable.productId, productId)))
      .returning();

    if (!deletedItem.length) {
      return c.json({ error: 'Produkt nicht in der Bestellung gefunden' }, 404);
    }

    return c.json({ message: 'Produkt erfolgreich aus Bestellung entfernt' });
  } catch (error) {
    return c.json({ error: 'Fehler beim Entfernen des Produkts aus der Bestellung' }, 500);
  }
});

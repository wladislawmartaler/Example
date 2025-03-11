import { Hono } from 'hono';
import { db } from '../db/config';
import { orders, orderPositions, products } from '../db/schema';
import { eq } from 'drizzle-orm';

export const ordersRouter = new Hono();

// 📌 Alle Bestellungen eines Users abrufen (GET /users/:id/orders)
ordersRouter.get('/:id/orders', async (c) => {
  const userId = Number(c.req.param('id'));
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));

    return c.json(userOrders);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen der Bestellungen' }, 500);
  }
});

// 📌 Neue Bestellung für einen User anlegen (POST /users/:id/orders)
ordersRouter.post('/:id/orders', async (c) => {
  const userId = Number(c.req.param('id'));
  try {
    const newOrder = await db.insert(orders).values({ userId }).returning();
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
        orderId: orders.id,
        createdAt: orders.createdAt,
        productId: orderPositions.productId,
        quantity: orderPositions.quantity,
        productName: products.name,
        price: products.price,
      })
      .from(orders)
      .leftJoin(orderPositions, eq(orderPositions.orderId, orders.id))
      .leftJoin(products, eq(orderPositions.productId, products.id))
      .where(eq(orders.id, orderId));

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
      .insert(orderPositions)
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
      .delete(orderPositions)
      .where(eq(orderPositions.orderId, orderId))
      .where(eq(orderPositions.productId, productId))
      .returning();

    if (!deletedItem.length) {
      return c.json({ error: 'Produkt nicht in der Bestellung gefunden' }, 404);
    }

    return c.json({ message: 'Produkt erfolgreich aus Bestellung entfernt' });
  } catch (error) {
    return c.json({ error: 'Fehler beim Entfernen des Produkts aus der Bestellung' }, 500);
  }
});

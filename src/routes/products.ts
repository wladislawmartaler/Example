import { Hono } from 'hono';
import { db } from '../db/config';
import { productsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const productRouter = new Hono();

// 📌 Alle Produkte abrufen (GET /products)
productRouter.get('/', async (c) => {
  try {
    const allProducts = await db.select().from(productsTable);
    return c.json(allProducts);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen der Produkte' }, 500);
  }
});

// 📌 Einzelnes Produkt abrufen (GET /products/:id)
productRouter.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  try {
    const product = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product.length) {
      return c.json({ error: 'Produkt nicht gefunden' }, 404);
    }
    return c.json(product[0]);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen des Produkts' }, 500);
  }
});

// 📌 Neues Produkt erstellen (POST /products)
productRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const newProduct = await db
      .insert(productsTable)
      .values({
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
      })
      .returning();

    return c.json(newProduct[0], 201);
  } catch (error) {
    return c.json({ error: 'Fehler beim Erstellen des Produkts' }, 500);
  }
});

// 📌 Produkt aktualisieren (PUT /products/:id)
productRouter.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  try {
    const body = await c.req.json();
    const updatedProduct = await db
      .update(productsTable)
      .set({
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
      })
      .where(eq(productsTable.id, id))
      .returning();

    if (!updatedProduct.length) {
      return c.json({ error: 'Produkt nicht gefunden' }, 404);
    }

    return c.json(updatedProduct[0]);
  } catch (error) {
    return c.json({ error: 'Fehler beim Aktualisieren des Produkts' }, 500);
  }
});

// 📌 Produkt löschen (DELETE /products/:id)
productRouter.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  try {
    const deletedProduct = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
    if (!deletedProduct.length) {
      return c.json({ error: 'Produkt nicht gefunden' }, 404);
    }

    return c.json({ message: 'Produkt erfolgreich gelöscht' });
  } catch (error) {
    return c.json({ error: 'Fehler beim Löschen des Produkts' }, 500 );
  }
});

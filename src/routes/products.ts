import { Hono } from 'hono';
import { db } from '../db/client';
import { productsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const productRouter = new Hono();


productRouter.get('/', async (c) => {
    const limit = Number(c.req.query('limit')) || 10; // Standard: 10 Produkte pro Seite
    const page = Number(c.req.query('page')) || 1; // Standard: Seite 1
    const offset = (page - 1) * limit; // Offset für Pagination
  
    try {
      // Alle Produkte mit Limit + Offset abrufen
      const allProducts = await db
        .select()
        .from(productsTable)
        .limit(limit)
        .offset(offset);
  
      // Gesamtanzahl der Produkte für Pagination berechnen
      const totalProducts = await db.select({ count: productsTable.id }).from(productsTable);
      const totalCount = totalProducts[0]?.count || 0;
  
      return c.json({
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalProducts: totalCount,
        products: allProducts,
      });
    } catch (error) {
      return c.json({ error: 'Fehler beim Abrufen der Produkte' }, 500);
    }
  });
  
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

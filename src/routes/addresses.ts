import { Hono } from 'hono';
import { db } from '../db/client';
import { addressesTable } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const addressRouter = new Hono();

addressRouter.get('/:id/addresses', async (c) => {
  const userId = Number(c.req.param('id'));
  try {
    const userAddresses = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.userId, userId));

    return c.json(userAddresses);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen der Adressen' }, 500);
  }
});

addressRouter.post('/:id/addresses', async (c) => {
  const userId = Number(c.req.param('id'));
  try {
    const body = await c.req.json();
    const newAddress = await db
      .insert(addressesTable)
      .values({
        userId,
        street: body.street,
        city: body.city,
        zipCode: body.zipCode,
        country: body.country,
      })
      .returning();

    return c.json(newAddress[0], 201);
  } catch (error) {
    return c.json({ error: 'Fehler beim Erstellen der Adresse' }, 500);
  }
});

addressRouter.put('/:userId/addresses/:addressId', async (c) => {
  const userId = Number(c.req.param('userId'));
  const addressId = Number(c.req.param('addressId'));

  try {
    const body = await c.req.json();
    const updatedAddress = await db
      .update(addressesTable)
      .set({
        street: body.street,
        city: body.city,
        zipCode: body.zipCode,
        country: body.country,
      })
      .where(and(eq(addressesTable.userId, userId), eq(addressesTable.id, addressId)))
      .returning();

    if (!updatedAddress.length) {
      return c.json({ error: 'Adresse nicht gefunden' }, 404);
    }

    return c.json(updatedAddress[0]);
  } catch (error) {
    return c.json({ error: 'Fehler beim Aktualisieren der Adresse' }, 500);
  }
});

addressRouter.delete('/:userId/addresses/:addressId', async (c) => {
  const userId = Number(c.req.param('userId'));
  const addressId = Number(c.req.param('addressId'));

  try {
    const deletedAddress = await db
      .delete(addressesTable)
      .where(and(eq(addressesTable.id, addressId), eq(addressesTable.userId, userId)))
      .returning();

    if (!deletedAddress.length) {
      return c.json({ error: 'Adresse nicht gefunden' }, 404);
    }

    return c.json({ message: 'Adresse erfolgreich gelöscht' });
  } catch (error) {
    return c.json({ error: 'Fehler beim Löschen der Adresse' }, 500);
  }
});

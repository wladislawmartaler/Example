import { Hono } from 'hono';
import { db } from '../db/client';
import { usersTable } from '../models/users';
import { eq } from 'drizzle-orm';
import { addressRouter } from './addresses'; // Adress-Router importieren
import {ordersRouter } from './orders';

const userRouter = new Hono();

userRouter.get('/', async (c) => {
  try {
    const allUsers = await db.select().from(usersTable);
    return c.json(allUsers);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen der Benutzer' }, 500);
  }
});

userRouter.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user.length) {
      return c.json({ error: 'Benutzer nicht gefunden' }, 404);
    }
    return c.json(user[0]);
  } catch (error) {
    return c.json({ error: 'Fehler beim Abrufen des Benutzers' }, 500);
  }
});

userRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const newUser = await db.insert(usersTable).values({
      username: body.username,
      email: body.email,
      passwordHash: body.passwordHash,
      role: body.role || 'customer',
      isVIP: body.isVIP || false
    }).returning();
    return c.json(newUser[0], 201);
  } catch (error) {
    return c.json({ error: 'Fehler beim Erstellen des Benutzers' }, 500);
  }
});

userRouter.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  try {
    const body = await c.req.json();
    const updatedUser = await db.update(usersTable)
      .set({ username: body.username, email: body.email, isVIP: body.isVIP })
      .where(eq(usersTable.id, id))
      .returning();

    if (!updatedUser.length) {
      return c.json({ error: 'Benutzer nicht gefunden' }, 404);
    }
    
    return c.json(updatedUser[0]);
  } catch (error) {
    return c.json({ error: 'Fehler beim Aktualisieren des Benutzers' }, 500);
  }
});

userRouter.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  try {
    const deletedUser = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    
    if (!deletedUser.length) {
      return c.json({ error: 'Benutzer nicht gefunden' }, 404);
    }

    return c.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    return c.json({ error: 'Fehler beim Löschen des Benutzers' }, 500);
  }
});

userRouter.route('/', addressRouter);
userRouter.route('/', ordersRouter);

export { userRouter };

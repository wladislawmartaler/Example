# Online Shop Revamped - Backend

## Verzeichnisstruktur

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts          # Authentifizierungsrouten
│   │   ├── products.ts      # Routen für Produkte
│   │   ├── orders.ts        # Routen für Bestellungen
│   ├── models/
│   │   ├── user.ts          # User-Modell
│   │   ├── address.ts       # Adressen-Modell
│   │   ├── product.ts       # Produkt-Modell
│   │   ├── order.ts         # Bestellungs-Modell
│   │   ├── orderPosition.ts # Bestellpositionen-Modell
│   ├── controllers/
│   │   ├── authController.ts      # Logik für Authentifizierung
│   │   ├── productController.ts   # Logik für Produkte
│   │   ├── orderController.ts     # Logik für Bestellungen
│   ├── middleware/
│   │   ├── authMiddleware.ts # Middleware zur Authentifizierung
│   ├── config/
│   │   ├── db.ts             # Datenbank-Konfiguration
│   ├── index.ts              # Einstiegspunkt der API
├── package.json              # Abhängigkeiten & Scripts
├── tsconfig.json             # TypeScript-Konfiguration
```

## Funktionalität

### 1. Authentifizierung (`auth.ts`)
- Registrieren und Anmelden
- JWT-Token-Generierung und Überprüfung
- Middleware zum Schutz von privaten Routen

### 2. Produkte (`products.ts`)
- Abrufen aller Produkte
- Abrufen eines einzelnen Produkts
- (Admin) Erstellen, Bearbeiten und Löschen von Produkten

### 3. Bestellungen (`orders.ts`)
- Bestellungen eines Nutzers abrufen
- Neue Bestellung anlegen
- Bestellstatus aktualisieren (Admin-Funktion)

## Datenbankstruktur

### User (`models/user.ts`)
```typescript
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull()
});
```

### Addressen (`models/address.ts`)
```typescript
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  street: text('street').notNull(),
  city: text('city').notNull()
});
```

### Produkte (`models/product.ts`)
```typescript
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull()
});
```

### Bestellungen (`models/order.ts`)
```typescript
import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});
```

### Bestellpositionen (`models/orderPosition.ts`)
```typescript
import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

export const orderPositions = pgTable('order_positions', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull()
});
```

## Installation & Starten
```bash
cd backend
bun install
bun run dev  # Startet den Entwicklungsserver
```

## Docker-Setup
```bash
docker-compose up --build
```
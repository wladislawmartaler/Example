import { Hono } from 'hono';
import { userRouter } from './routes/users';
import { productRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Home
app.get('/', (c) => c.text('Online Shop'));

// Routen
app.route('/users', userRouter);
app.route('/products', productRouter);
app.route('/orders', ordersRouter);

export default {
  port: 3000,
  fetch: app.fetch,
};

import { Hono } from 'hono';
import { userRouter } from './routes/users';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health Check Route
app.get('/', (c) => c.text('API is running 🚀'));

// User Routen einbinden
app.route('/users', userRouter);

// Server starten
export default {
  port: 3000,
  fetch: app.fetch
};

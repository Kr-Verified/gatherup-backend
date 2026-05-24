import { handle } from '@hono/node-server/vercel';
import app from './infrastructure/server';

export default handle(app);

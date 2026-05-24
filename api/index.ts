import { handle } from '@hono/node-server/vercel';
import app from '../src/infrastructure/server';

export default handle(app);

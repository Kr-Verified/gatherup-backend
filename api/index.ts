import { Hono } from 'hono';
import { handle } from '@hono/node-server/vercel';
import app from '../src/infrastructure/server';

void Hono;

export default handle(app);

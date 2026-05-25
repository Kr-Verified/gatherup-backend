import { serve } from '@hono/node-server';
import app from './infrastructure/server';

const port = Number(process.env.PORT || 4000);

console.log(`GatherUp Backend running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

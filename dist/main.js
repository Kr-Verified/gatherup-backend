import { serve } from '@hono/node-server';
import app from './infrastructure/server';
const port = 4000;
console.log(`🚀 GatherUp Backend running on http://localhost:${port}`);
serve({
    fetch: app.fetch,
    port,
});
//# sourceMappingURL=main.js.map
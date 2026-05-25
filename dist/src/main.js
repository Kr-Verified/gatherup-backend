"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const server_1 = __importDefault(require("./infrastructure/server"));
const port = Number(process.env.PORT || 4000);
console.log(`GatherUp Backend running on port ${port}`);
(0, node_server_1.serve)({
    fetch: server_1.default.fetch,
    port,
});
//# sourceMappingURL=main.js.map
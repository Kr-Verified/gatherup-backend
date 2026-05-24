"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxDuration = void 0;
const hono_1 = require("hono");
const vercel_1 = require("@hono/node-server/vercel");
const server_1 = __importDefault(require("../src/infrastructure/server"));
void hono_1.Hono;
exports.maxDuration = 30;
exports.default = (0, vercel_1.handle)(server_1.default);
//# sourceMappingURL=index.js.map
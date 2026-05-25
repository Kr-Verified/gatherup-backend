"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    transactionOptions: {
        maxWait: 3_000,
        timeout: 5_000,
    },
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map
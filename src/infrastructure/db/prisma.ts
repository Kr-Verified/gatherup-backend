import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 3_000,
    timeout: 5_000,
  },
});

export default prisma;

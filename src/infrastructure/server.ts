import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { PrismaUserRepository } from './db/PrismaUserRepository';
import { PrismaRoomRepository } from './db/PrismaRoomRepository';
import { PrismaScheduleRepository } from './db/PrismaScheduleRepository';
import { AuthUseCase } from '../usecase/auth/AuthUseCase';
import { RoomUseCase } from '../usecase/room/RoomUseCase';
import { ScheduleUseCase } from '../usecase/schedule/ScheduleUseCase';
import { AuthController } from '../interface/controllers/AuthController';
import { RoomController } from '../interface/controllers/RoomController';
import { ScheduleController } from '../interface/controllers/ScheduleController';
import prisma from './db/prisma';

const app = new Hono();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  ...(process.env.FRONTEND_ORIGIN || '').split(',').map((origin) => origin.trim()),
].filter((origin): origin is string => Boolean(origin));

function resolveCorsOrigin(origin: string): string | undefined {
  if (allowedOrigins.includes(origin)) return origin;
  return undefined;
}

function applyCorsHeaders(c: any): void {
  const origin = c.req.header('Origin');
  const allowedOrigin = origin ? resolveCorsOrigin(origin) : undefined;
  if (allowedOrigin) {
    c.header('Access-Control-Allow-Origin', allowedOrigin);
    c.header('Vary', 'Origin');
  }
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(c: any): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    'unknown'
  );
}

function rateLimit(limit: number, windowMs: number) {
  return async (c: any, next: any) => {
    const key = `${getClientIp(c)}:${c.req.path}`;
    const now = Date.now();
    const current = rateLimitStore.get(key);

    if (!current || current.resetAt <= now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= limit) {
      return c.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, 429);
    }

    current.count += 1;
    return next();
  };
}

// Middleware
app.use('*', logger());
app.use('*', async (c, next) => {
  applyCorsHeaders(c);
  await next();
  applyCorsHeaders(c);
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  c.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
});
app.use(
  '*',
  cors({
    origin: resolveCorsOrigin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use('*', async (c, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(c.req.method)) {
    if (!isAllowedOrigin(c.req.header('Origin'))) {
      return c.json({ error: '허용되지 않은 요청 출처입니다.' }, 403);
    }

    const contentLength = Number(c.req.header('Content-Length') || 0);
    if (contentLength > 1_100_000) {
      return c.json({ error: '요청 본문이 너무 큽니다.' }, 413);
    }
  }

  await next();
});

app.onError((error, c) => {
  applyCorsHeaders(c);
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  return c.json({ error: '서버 오류가 발생했습니다.' }, 500);
});

// Dependency Injection
const userRepo = new PrismaUserRepository();
const roomRepo = new PrismaRoomRepository();
const scheduleRepo = new PrismaScheduleRepository();

const authUseCase = new AuthUseCase(userRepo);
const roomUseCase = new RoomUseCase(roomRepo, scheduleRepo);
const scheduleUseCase = new ScheduleUseCase(scheduleRepo);

const authController = new AuthController(authUseCase);
const roomController = new RoomController(roomUseCase);
const scheduleController = new ScheduleController(scheduleUseCase);

app.get('/api/health', (c) => c.json({ ok: true, time: new Date().toISOString() }));

app.get('/api/health/db', async (c) => {
  try {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database health check timed out.')), 5_000);
    });
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    return c.json({ ok: true, database: 'connected' });
  } catch (error: any) {
    return c.json({ ok: false, database: 'failed', error: error.message }, 503);
  }
});

app.get('/api/health/users', async (c) => {
  try {
    const startedAt = Date.now();
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Users table health check timed out.')), 4_000);
    });
    const count = await Promise.race([prisma.user.count(), timeout]);
    return c.json({ ok: true, usersTable: 'connected', count, durationMs: Date.now() - startedAt });
  } catch (error: any) {
    return c.json({ ok: false, usersTable: 'failed', error: error.message }, 503);
  }
});

app.get('/api/health/google', async (c) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);
  const startedAt = Date.now();

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs', {
      signal: controller.signal,
    });
    return c.json({
      ok: response.ok,
      status: response.status,
      durationMs: Date.now() - startedAt,
    });
  } catch (error: any) {
    return c.json({
      ok: false,
      error: error.name === 'AbortError' ? 'Google request timed out.' : error.message,
      durationMs: Date.now() - startedAt,
    }, 503);
  } finally {
    clearTimeout(timeout);
  }
});

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', rateLimit(8, 60_000), authController.login);
app.get('/api/auth/check-id', authController.checkDuplicateId);
app.post('/api/auth/google', rateLimit(12, 60_000), authController.googleLogin);
app.get('/api/user/me', authController.getMe);
app.put('/api/user/me', authController.updateProfile);
app.delete('/api/user/delete', authController.deleteAccount);

// Room routes
app.post('/api/rooms', roomController.createRoom);
app.post('/api/rooms/join', roomController.joinRoom);
app.get('/api/rooms', roomController.listMyRooms);
app.get('/api/rooms/:id', roomController.getRoomDetail);
app.put('/api/rooms/:id', roomController.updateRoomName);
app.put('/api/rooms/:id/settings', roomController.updateRoomSettings);
app.get('/api/rooms/:id/available-dates', roomController.getAvailableDates);

// Schedule routes
app.get('/api/schedules', scheduleController.listSchedules);
app.post('/api/schedules', scheduleController.createSchedule);
app.put('/api/schedules/:id', scheduleController.updateSchedule);
app.delete('/api/schedules/:id', scheduleController.deleteSchedule);

export default app;

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

  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol === 'https:' && hostname.endsWith('.netlify.app')) {
      return origin;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: resolveCorsOrigin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

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
app.post('/api/auth/login', authController.login);
app.get('/api/auth/check-id', authController.checkDuplicateId);
app.post('/api/auth/google', authController.googleLogin);
app.get('/api/user/me', authController.getMe);
app.delete('/api/user/delete', authController.deleteAccount);

// Room routes
app.post('/api/rooms', roomController.createRoom);
app.post('/api/rooms/join', roomController.joinRoom);
app.get('/api/rooms', roomController.listMyRooms);
app.get('/api/rooms/:id', roomController.getRoomDetail);
app.put('/api/rooms/:id', roomController.updateRoomName);
app.get('/api/rooms/:id/available-dates', roomController.getAvailableDates);

// Schedule routes
app.get('/api/schedules', scheduleController.listSchedules);
app.post('/api/schedules', scheduleController.createSchedule);
app.put('/api/schedules/:id', scheduleController.updateSchedule);
app.delete('/api/schedules/:id', scheduleController.deleteSchedule);

export default app;

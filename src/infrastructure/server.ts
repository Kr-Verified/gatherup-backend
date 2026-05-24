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

const app = new Hono();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  ...(process.env.FRONTEND_ORIGIN || '').split(',').map((origin) => origin.trim()),
].filter((origin): origin is string => Boolean(origin));

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: allowedOrigins,
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

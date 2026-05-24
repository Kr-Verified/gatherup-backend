"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const logger_1 = require("hono/logger");
const PrismaUserRepository_1 = require("./db/PrismaUserRepository");
const PrismaRoomRepository_1 = require("./db/PrismaRoomRepository");
const PrismaScheduleRepository_1 = require("./db/PrismaScheduleRepository");
const AuthUseCase_1 = require("../usecase/auth/AuthUseCase");
const RoomUseCase_1 = require("../usecase/room/RoomUseCase");
const ScheduleUseCase_1 = require("../usecase/schedule/ScheduleUseCase");
const AuthController_1 = require("../interface/controllers/AuthController");
const RoomController_1 = require("../interface/controllers/RoomController");
const ScheduleController_1 = require("../interface/controllers/ScheduleController");
const app = new hono_1.Hono();
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.FRONTEND_ORIGIN || '').split(',').map((origin) => origin.trim()),
].filter((origin) => Boolean(origin));
// Middleware
app.use('*', (0, logger_1.logger)());
app.use('*', (0, cors_1.cors)({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));
// Dependency Injection
const userRepo = new PrismaUserRepository_1.PrismaUserRepository();
const roomRepo = new PrismaRoomRepository_1.PrismaRoomRepository();
const scheduleRepo = new PrismaScheduleRepository_1.PrismaScheduleRepository();
const authUseCase = new AuthUseCase_1.AuthUseCase(userRepo);
const roomUseCase = new RoomUseCase_1.RoomUseCase(roomRepo, scheduleRepo);
const scheduleUseCase = new ScheduleUseCase_1.ScheduleUseCase(scheduleRepo);
const authController = new AuthController_1.AuthController(authUseCase);
const roomController = new RoomController_1.RoomController(roomUseCase);
const scheduleController = new ScheduleController_1.ScheduleController(scheduleUseCase);
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
exports.default = app;
//# sourceMappingURL=server.js.map
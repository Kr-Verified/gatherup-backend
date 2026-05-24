"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaScheduleRepository = void 0;
const Schedule_1 = require("../../domain/Schedule");
const prisma_1 = __importDefault(require("./prisma"));
class PrismaScheduleRepository {
    async create(userId, startDate, endDate, title, color) {
        const schedule = await prisma_1.default.schedule.create({
            data: { userId, startDate, endDate, title, color },
        });
        return new Schedule_1.Schedule(schedule.id, schedule.userId, schedule.startDate, schedule.endDate, schedule.title, schedule.color, schedule.createdAt);
    }
    async findById(id) {
        const schedule = await prisma_1.default.schedule.findUnique({ where: { id } });
        if (!schedule)
            return null;
        return new Schedule_1.Schedule(schedule.id, schedule.userId, schedule.startDate, schedule.endDate, schedule.title, schedule.color, schedule.createdAt);
    }
    async findByUserId(userId) {
        const schedules = await prisma_1.default.schedule.findMany({
            where: { userId },
            orderBy: { startDate: 'asc' },
        });
        return schedules.map((s) => new Schedule_1.Schedule(s.id, s.userId, s.startDate, s.endDate, s.title, s.color, s.createdAt));
    }
    async findByUserIds(userIds, startDate, endDate) {
        const schedules = await prisma_1.default.schedule.findMany({
            where: {
                userId: { in: userIds },
                OR: [
                    { startDate: { lte: endDate }, endDate: { gte: startDate } },
                ],
            },
        });
        return schedules.map((s) => new Schedule_1.Schedule(s.id, s.userId, s.startDate, s.endDate, s.title, s.color, s.createdAt));
    }
    async update(id, data) {
        const schedule = await prisma_1.default.schedule.update({
            where: { id },
            data,
        });
        return new Schedule_1.Schedule(schedule.id, schedule.userId, schedule.startDate, schedule.endDate, schedule.title, schedule.color, schedule.createdAt);
    }
    async delete(id) {
        await prisma_1.default.schedule.delete({ where: { id } });
    }
}
exports.PrismaScheduleRepository = PrismaScheduleRepository;
//# sourceMappingURL=PrismaScheduleRepository.js.map
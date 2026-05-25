"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleUseCase = void 0;
const validation_1 = require("../validation");
class ScheduleUseCase {
    scheduleRepo;
    constructor(scheduleRepo) {
        this.scheduleRepo = scheduleRepo;
    }
    async createSchedule(userId, startDate, endDate, title, color) {
        if (startDate > endDate) {
            throw new Error('시작일이 종료일보다 늦을 수 없습니다.');
        }
        const safeColor = color ? (0, validation_1.validateHexColor)(color) : undefined;
        return this.scheduleRepo.create(userId, startDate, endDate, (0, validation_1.cleanText)(title, '일정 제목', 80), safeColor);
    }
    async getMySchedules(userId) {
        return this.scheduleRepo.findByUserId(userId);
    }
    async updateSchedule(id, userId, data) {
        const schedule = await this.scheduleRepo.findById(id);
        if (!schedule) {
            throw new Error('일정을 찾을 수 없습니다.');
        }
        if (schedule.userId !== userId) {
            throw new Error('본인의 일정만 수정할 수 있습니다.');
        }
        const nextData = { ...data };
        if (nextData.title !== undefined)
            nextData.title = (0, validation_1.cleanText)(nextData.title, '일정 제목', 80);
        if (nextData.color !== undefined)
            nextData.color = (0, validation_1.validateHexColor)(nextData.color);
        return this.scheduleRepo.update(id, nextData);
    }
    async deleteSchedule(id, userId) {
        const schedule = await this.scheduleRepo.findById(id);
        if (!schedule) {
            throw new Error('일정을 찾을 수 없습니다.');
        }
        if (schedule.userId !== userId) {
            throw new Error('본인의 일정만 삭제할 수 있습니다.');
        }
        return this.scheduleRepo.delete(id);
    }
}
exports.ScheduleUseCase = ScheduleUseCase;
//# sourceMappingURL=ScheduleUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const auth_1 = require("../http/auth");
class ScheduleController {
    scheduleUseCase;
    constructor(scheduleUseCase) {
        this.scheduleUseCase = scheduleUseCase;
    }
    listSchedules = async (c) => {
        try {
            const userId = (0, auth_1.getAuthenticatedUserId)(c);
            if (!userId)
                return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
            const schedules = await this.scheduleUseCase.getMySchedules(userId);
            return c.json(schedules);
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    };
    createSchedule = async (c) => {
        try {
            const userId = (0, auth_1.getAuthenticatedUserId)(c);
            if (!userId)
                return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
            const body = await c.req.json();
            const { startDate, endDate, title, color } = body;
            if (!startDate || !endDate || !title) {
                return c.json({ error: '시작일, 종료일, 제목을 입력해주세요.' }, 400);
            }
            const schedule = await this.scheduleUseCase.createSchedule(userId, new Date(startDate), new Date(endDate), title, color);
            return c.json(schedule, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    };
    updateSchedule = async (c) => {
        try {
            const userId = (0, auth_1.getAuthenticatedUserId)(c);
            if (!userId)
                return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
            const id = c.req.param('id');
            const body = await c.req.json();
            const { startDate, endDate, title, color } = body;
            const data = {};
            if (startDate)
                data.startDate = new Date(startDate);
            if (endDate)
                data.endDate = new Date(endDate);
            if (title !== undefined)
                data.title = title;
            if (color !== undefined)
                data.color = color;
            const schedule = await this.scheduleUseCase.updateSchedule(id, userId, data);
            return c.json(schedule);
        }
        catch (error) {
            const status = error.message.includes('찾을 수 없') ? 404 : 403;
            return c.json({ error: error.message }, status);
        }
    };
    deleteSchedule = async (c) => {
        try {
            const userId = (0, auth_1.getAuthenticatedUserId)(c);
            if (!userId)
                return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
            const id = c.req.param('id');
            await this.scheduleUseCase.deleteSchedule(id, userId);
            return c.json({ message: '삭제되었습니다.' });
        }
        catch (error) {
            const status = error.message.includes('찾을 수 없') ? 404 : 403;
            return c.json({ error: error.message }, status);
        }
    };
}
exports.ScheduleController = ScheduleController;
//# sourceMappingURL=ScheduleController.js.map
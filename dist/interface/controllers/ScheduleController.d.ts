import { Context } from 'hono';
import { ScheduleUseCase } from '../../usecase/schedule/ScheduleUseCase';
export declare class ScheduleController {
    private scheduleUseCase;
    constructor(scheduleUseCase: ScheduleUseCase);
    listSchedules: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        userId: string;
        startDate: string;
        endDate: string;
        title: string;
        color: string | null;
        createdAt: string;
    }[], import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500, "json">)>;
    createSchedule: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        userId: string;
        startDate: string;
        endDate: string;
        title: string;
        color: string | null;
        createdAt: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 400, "json">)>;
    updateSchedule: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        userId: string;
        startDate: string;
        endDate: string;
        title: string;
        color: string | null;
        createdAt: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 403 | 404, "json">)>;
    deleteSchedule: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 403 | 404, "json">)>;
}
//# sourceMappingURL=ScheduleController.d.ts.map
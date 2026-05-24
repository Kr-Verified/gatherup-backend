import { Schedule } from '../../domain/Schedule';
import { ScheduleRepository } from '../../interface/repositories/ScheduleRepository';
export declare class ScheduleUseCase {
    private scheduleRepo;
    constructor(scheduleRepo: ScheduleRepository);
    createSchedule(userId: string, startDate: Date, endDate: Date, title: string, color?: string): Promise<Schedule>;
    getMySchedules(userId: string): Promise<Schedule[]>;
    updateSchedule(id: string, userId: string, data: Partial<{
        startDate: Date;
        endDate: Date;
        title: string;
        color: string;
    }>): Promise<Schedule>;
    deleteSchedule(id: string, userId: string): Promise<void>;
}
//# sourceMappingURL=ScheduleUseCase.d.ts.map
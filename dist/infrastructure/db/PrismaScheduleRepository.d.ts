import { ScheduleRepository } from '../../interface/repositories/ScheduleRepository';
import { Schedule } from '../../domain/Schedule';
export declare class PrismaScheduleRepository implements ScheduleRepository {
    create(userId: string, startDate: Date, endDate: Date, title: string, color?: string): Promise<Schedule>;
    findById(id: string): Promise<Schedule | null>;
    findByUserId(userId: string): Promise<Schedule[]>;
    findByUserIds(userIds: string[], startDate: Date, endDate: Date): Promise<Schedule[]>;
    update(id: string, data: Partial<{
        startDate: Date;
        endDate: Date;
        title: string;
        color: string;
    }>): Promise<Schedule>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=PrismaScheduleRepository.d.ts.map
import { Schedule } from '../../domain/Schedule';

export interface ScheduleRepository {
  create(userId: string, startDate: Date, endDate: Date, title: string, color?: string): Promise<Schedule>;
  createMany(userId: string, schedules: Array<{ startDate: Date; endDate: Date; title: string; color?: string }>): Promise<number>;
  findById(id: string): Promise<Schedule | null>;
  findByUserId(userId: string): Promise<Schedule[]>;
  findByUserIds(userIds: string[], startDate: Date, endDate: Date): Promise<Schedule[]>;
  update(id: string, data: Partial<{ startDate: Date; endDate: Date; title: string; color: string }>): Promise<Schedule>;
  delete(id: string): Promise<void>;
}

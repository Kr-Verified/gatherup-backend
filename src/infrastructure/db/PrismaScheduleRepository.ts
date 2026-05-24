import { ScheduleRepository } from '../../interface/repositories/ScheduleRepository';
import { Schedule } from '../../domain/Schedule';
import prisma from './prisma';

export class PrismaScheduleRepository implements ScheduleRepository {
  async create(userId: string, startDate: Date, endDate: Date, title: string, color?: string): Promise<Schedule> {
    const schedule = await prisma.schedule.create({
      data: { userId, startDate, endDate, title, color },
    });
    return new Schedule(schedule.id, schedule.userId, schedule.startDate, schedule.endDate, schedule.title, schedule.color, schedule.createdAt);
  }

  async findById(id: string): Promise<Schedule | null> {
    const schedule = await prisma.schedule.findUnique({ where: { id } });
    if (!schedule) return null;
    return new Schedule(schedule.id, schedule.userId, schedule.startDate, schedule.endDate, schedule.title, schedule.color, schedule.createdAt);
  }

  async findByUserId(userId: string): Promise<Schedule[]> {
    const schedules = await prisma.schedule.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
    });
    return schedules.map(
      (s) => new Schedule(s.id, s.userId, s.startDate, s.endDate, s.title, s.color, s.createdAt)
    );
  }

  async findByUserIds(userIds: string[], startDate: Date, endDate: Date): Promise<Schedule[]> {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: { in: userIds },
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
      },
    });
    return schedules.map(
      (s) => new Schedule(s.id, s.userId, s.startDate, s.endDate, s.title, s.color, s.createdAt)
    );
  }

  async update(id: string, data: Partial<{ startDate: Date; endDate: Date; title: string; color: string }>): Promise<Schedule> {
    const schedule = await prisma.schedule.update({
      where: { id },
      data,
    });
    return new Schedule(schedule.id, schedule.userId, schedule.startDate, schedule.endDate, schedule.title, schedule.color, schedule.createdAt);
  }

  async delete(id: string): Promise<void> {
    await prisma.schedule.delete({ where: { id } });
  }
}

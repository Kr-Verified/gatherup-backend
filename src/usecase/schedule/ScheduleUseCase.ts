import { Schedule } from '../../domain/Schedule';
import { ScheduleRepository } from '../../interface/repositories/ScheduleRepository';
import { cleanText, validateHexColor } from '../validation';

export class ScheduleUseCase {
  constructor(private scheduleRepo: ScheduleRepository) {}

  async createSchedule(userId: string, startDate: Date, endDate: Date, title: string, color?: string): Promise<Schedule> {
    if (startDate > endDate) {
      throw new Error('시작일이 종료일보다 늦을 수 없습니다.');
    }
    const safeColor = color ? validateHexColor(color) : undefined;
    return this.scheduleRepo.create(userId, startDate, endDate, cleanText(title, '일정 제목', 80), safeColor);
  }

  async getMySchedules(userId: string): Promise<Schedule[]> {
    return this.scheduleRepo.findByUserId(userId);
  }

  async importSchedules(
    userId: string,
    schedules: Array<{ startDate: Date; endDate: Date; title: string; color?: string }>
  ): Promise<{ importedCount: number }> {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      throw new Error('가져올 일정이 없습니다.');
    }
    if (schedules.length > 100) {
      throw new Error('한 번에 최대 100개 일정만 가져올 수 있습니다.');
    }

    const safeSchedules = schedules.map((schedule) => {
      if (!(schedule.startDate instanceof Date) || Number.isNaN(schedule.startDate.getTime())) {
        throw new Error('시작일 형식이 올바르지 않습니다.');
      }
      if (!(schedule.endDate instanceof Date) || Number.isNaN(schedule.endDate.getTime())) {
        throw new Error('종료일 형식이 올바르지 않습니다.');
      }
      if (schedule.startDate > schedule.endDate) {
        throw new Error('시작일이 종료일보다 늦을 수 없습니다.');
      }
      return {
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        title: cleanText(schedule.title, '일정 제목', 80),
        color: schedule.color ? validateHexColor(schedule.color) : '#06b6d4',
      };
    });

    const importedCount = await this.scheduleRepo.createMany(userId, safeSchedules);
    return { importedCount };
  }

  async updateSchedule(
    id: string,
    userId: string,
    data: Partial<{ startDate: Date; endDate: Date; title: string; color: string }>
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new Error('일정을 찾을 수 없습니다.');
    }
    if (schedule.userId !== userId) {
      throw new Error('본인의 일정만 수정할 수 있습니다.');
    }
    const nextData = { ...data };
    if (nextData.title !== undefined) nextData.title = cleanText(nextData.title, '일정 제목', 80);
    if (nextData.color !== undefined) nextData.color = validateHexColor(nextData.color);
    return this.scheduleRepo.update(id, nextData);
  }

  async deleteSchedule(id: string, userId: string): Promise<void> {
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

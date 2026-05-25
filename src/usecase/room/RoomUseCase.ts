import { Room } from '../../domain/Room';
import { RoomMember } from '../../domain/RoomMember';
import { RoomRepository } from '../../interface/repositories/RoomRepository';
import { ScheduleRepository } from '../../interface/repositories/ScheduleRepository';
import { cleanText, validateHexColor, validateTheme } from '../validation';
import * as bcrypt from 'bcryptjs';

export interface DateAvailability {
  date: string;
  availableCount: number;
  totalCount: number;
  status: 'all-free' | 'some-busy' | 'all-busy';
  busyMembers: string[];
}

export class RoomUseCase {
  constructor(
    private roomRepo: RoomRepository,
    private scheduleRepo: ScheduleRepository
  ) {}

  async createRoom(name: string, password: string | null, creatorId: string): Promise<Room> {
    const inviteCode = this.generateInviteCode();
    const safePassword = password ? cleanText(password, '방 비밀번호', 128) : null;
    const hashedPassword = safePassword ? await bcrypt.hash(safePassword, 10) : null;
    const room = await this.roomRepo.create(cleanText(name, '방 이름', 50), hashedPassword, inviteCode, creatorId);
    // Creator automatically joins the room
    await this.roomRepo.addMember(room.id, creatorId);
    return room;
  }

  async joinRoom(inviteCode: string, password: string | null, userId: string): Promise<Room> {
    const room = await this.roomRepo.findByInviteCode(inviteCode);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    if (room.password) {
      const isMatch = password ? await bcrypt.compare(password, room.password) : false;
      if (!isMatch) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
    }
    const alreadyMember = await this.roomRepo.isMember(room.id, userId);
    if (alreadyMember) {
      throw new Error('이미 참여한 방입니다.');
    }
    await this.roomRepo.addMember(room.id, userId);
    return room;
  }

  async getMyRooms(userId: string): Promise<Room[]> {
    return this.roomRepo.getRoomsByUserId(userId);
  }

  async getRoomDetail(roomId: string) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    const members = await this.roomRepo.getMembers(roomId);
    return { room, members };
  }

  async assertMember(roomId: string, userId: string): Promise<void> {
    const isMember = await this.roomRepo.isMember(roomId, userId);
    if (!isMember) {
      throw new Error('방 멤버만 접근할 수 있습니다.');
    }
  }

  async updateRoomName(roomId: string, name: string, userId: string): Promise<Room> {
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    if (room.creatorId !== userId) {
      throw new Error('방장만 방 이름을 수정할 수 있습니다.');
    }
    return this.roomRepo.updateName(roomId, name);
  }

  async updateRoomSettings(
    roomId: string,
    data: Partial<{ name: string; nameColor: string; theme: string }>,
    userId: string
  ): Promise<Room> {
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    if (room.creatorId !== userId) {
      throw new Error('방장만 방 설정을 수정할 수 있습니다.');
    }

    const nextData: Partial<{ name: string; nameColor: string; theme: string }> = {};
    if (data.name !== undefined) {
      nextData.name = cleanText(data.name, '방 이름', 50);
    }
    if (data.nameColor !== undefined) nextData.nameColor = validateHexColor(data.nameColor);
    if (data.theme !== undefined) nextData.theme = validateTheme(data.theme);

    return this.roomRepo.updateSettings(roomId, nextData);
  }

  async getAvailableDates(
    roomId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DateAvailability[]> {
    const members = await this.roomRepo.getMembers(roomId);
    const userIds = members.map((m) => m.userId);

    if (userIds.length === 0) {
      return [];
    }

    const schedules = await this.scheduleRepo.findByUserIds(userIds, startDate, endDate);
    const result: DateAvailability[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const currentTime = current.getTime();

      const busyUserIds = schedules
        .filter((s) => {
          const sStart = new Date(s.startDate).setHours(0, 0, 0, 0);
          const sEnd = new Date(s.endDate).setHours(23, 59, 59, 999);
          return currentTime >= sStart && currentTime <= sEnd;
        })
        .map((s) => s.userId);

      const uniqueBusyUsers = [...new Set(busyUserIds)];

      result.push({
        date: dateStr,
        availableCount: userIds.length - uniqueBusyUsers.length,
        totalCount: userIds.length,
        status:
          uniqueBusyUsers.length === 0
            ? 'all-free'
            : uniqueBusyUsers.length === userIds.length
              ? 'all-busy'
              : 'some-busy',
        busyMembers: uniqueBusyUsers,
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

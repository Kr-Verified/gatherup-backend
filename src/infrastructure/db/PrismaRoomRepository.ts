import { RoomRepository } from '../../interface/repositories/RoomRepository';
import { Room } from '../../domain/Room';
import { RoomMember } from '../../domain/RoomMember';
import prisma from './prisma';

export class PrismaRoomRepository implements RoomRepository {
  async create(name: string, password: string | null, inviteCode: string, creatorId: string): Promise<Room> {
    const room = await prisma.room.create({
      data: { name, password, inviteCode, creatorId },
    });
    return this.toDomain(room);
  }

  async findById(id: string): Promise<Room | null> {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return null;
    return this.toDomain(room);
  }

  async findByInviteCode(inviteCode: string): Promise<Room | null> {
    const room = await prisma.room.findUnique({ where: { inviteCode } });
    if (!room) return null;
    return this.toDomain(room);
  }

  async addMember(roomId: string, userId: string): Promise<RoomMember> {
    const member = await prisma.roomMember.create({
      data: { roomId, userId },
    });
    return new RoomMember(member.id, member.roomId, member.userId, member.joinedAt);
  }

  async getMembers(roomId: string): Promise<(RoomMember & { user: { nickname: string; profileImageUrl: string | null } })[]> {
    const members = await prisma.roomMember.findMany({
      where: { roomId },
      include: { user: { select: { nickname: true, profileImageUrl: true } } },
    });
    return members.map((m) => ({
      ...new RoomMember(m.id, m.roomId, m.userId, m.joinedAt),
      user: { nickname: m.user.nickname, profileImageUrl: m.user.profileImageUrl },
    }));
  }

  async getRoomsByUserId(userId: string): Promise<Room[]> {
    const memberships = await prisma.roomMember.findMany({
      where: { userId },
      include: { room: true },
    });
    return memberships.map(
      (m) => this.toDomain(m.room)
    );
  }

  async isMember(roomId: string, userId: string): Promise<boolean> {
    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    return !!member;
  }

  async updateName(roomId: string, name: string): Promise<Room> {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { name },
    });
    return this.toDomain(room);
  }

  async updateSettings(roomId: string, data: Partial<{ name: string; nameColor: string; theme: string }>): Promise<Room> {
    const room = await prisma.room.update({
      where: { id: roomId },
      data,
    });
    return this.toDomain(room);
  }

  private toDomain(room: {
    id: string;
    name: string;
    inviteCode: string;
    password: string | null;
    createdAt: Date;
    creatorId: string;
    nameColor: string;
    theme: string;
  }): Room {
    return new Room(
      room.id,
      room.name,
      room.inviteCode,
      room.password,
      room.createdAt,
      room.creatorId,
      room.nameColor,
      room.theme
    );
  }
}

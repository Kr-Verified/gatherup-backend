import { RoomRepository } from '../../interface/repositories/RoomRepository';
import { Room } from '../../domain/Room';
import { RoomMember } from '../../domain/RoomMember';
import prisma from './prisma';

export class PrismaRoomRepository implements RoomRepository {
  async create(name: string, password: string | null, inviteCode: string, creatorId: string): Promise<Room> {
    const room = await prisma.room.create({
      data: { name, password, inviteCode, creatorId },
    });
    return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
  }

  async findById(id: string): Promise<Room | null> {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return null;
    return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
  }

  async findByInviteCode(inviteCode: string): Promise<Room | null> {
    const room = await prisma.room.findUnique({ where: { inviteCode } });
    if (!room) return null;
    return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
  }

  async addMember(roomId: string, userId: string): Promise<RoomMember> {
    const member = await prisma.roomMember.create({
      data: { roomId, userId },
    });
    return new RoomMember(member.id, member.roomId, member.userId, member.joinedAt);
  }

  async getMembers(roomId: string): Promise<(RoomMember & { user: { nickname: string } })[]> {
    const members = await prisma.roomMember.findMany({
      where: { roomId },
      include: { user: { select: { nickname: true } } },
    });
    return members.map((m) => ({
      ...new RoomMember(m.id, m.roomId, m.userId, m.joinedAt),
      user: { nickname: m.user.nickname },
    }));
  }

  async getRoomsByUserId(userId: string): Promise<Room[]> {
    const memberships = await prisma.roomMember.findMany({
      where: { userId },
      include: { room: true },
    });
    return memberships.map(
      (m) => new Room(m.room.id, m.room.name, m.room.inviteCode, m.room.password, m.room.createdAt, m.room.creatorId)
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
    return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
  }
}

import { Room } from '../../domain/Room';
import { RoomMember } from '../../domain/RoomMember';
import prisma from './prisma';
export class PrismaRoomRepository {
    async create(name, password, inviteCode, creatorId) {
        const room = await prisma.room.create({
            data: { name, password, inviteCode, creatorId },
        });
        return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
    async findById(id) {
        const room = await prisma.room.findUnique({ where: { id } });
        if (!room)
            return null;
        return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
    async findByInviteCode(inviteCode) {
        const room = await prisma.room.findUnique({ where: { inviteCode } });
        if (!room)
            return null;
        return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
    async addMember(roomId, userId) {
        const member = await prisma.roomMember.create({
            data: { roomId, userId },
        });
        return new RoomMember(member.id, member.roomId, member.userId, member.joinedAt);
    }
    async getMembers(roomId) {
        const members = await prisma.roomMember.findMany({
            where: { roomId },
            include: { user: { select: { nickname: true } } },
        });
        return members.map((m) => ({
            ...new RoomMember(m.id, m.roomId, m.userId, m.joinedAt),
            user: { nickname: m.user.nickname },
        }));
    }
    async getRoomsByUserId(userId) {
        const memberships = await prisma.roomMember.findMany({
            where: { userId },
            include: { room: true },
        });
        return memberships.map((m) => new Room(m.room.id, m.room.name, m.room.inviteCode, m.room.password, m.room.createdAt, m.room.creatorId));
    }
    async isMember(roomId, userId) {
        const member = await prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        return !!member;
    }
    async updateName(roomId, name) {
        const room = await prisma.room.update({
            where: { id: roomId },
            data: { name },
        });
        return new Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
}
//# sourceMappingURL=PrismaRoomRepository.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRoomRepository = void 0;
const Room_1 = require("../../domain/Room");
const RoomMember_1 = require("../../domain/RoomMember");
const prisma_1 = __importDefault(require("./prisma"));
class PrismaRoomRepository {
    async create(name, password, inviteCode, creatorId) {
        const room = await prisma_1.default.room.create({
            data: { name, password, inviteCode, creatorId },
        });
        return new Room_1.Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
    async findById(id) {
        const room = await prisma_1.default.room.findUnique({ where: { id } });
        if (!room)
            return null;
        return new Room_1.Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
    async findByInviteCode(inviteCode) {
        const room = await prisma_1.default.room.findUnique({ where: { inviteCode } });
        if (!room)
            return null;
        return new Room_1.Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
    async addMember(roomId, userId) {
        const member = await prisma_1.default.roomMember.create({
            data: { roomId, userId },
        });
        return new RoomMember_1.RoomMember(member.id, member.roomId, member.userId, member.joinedAt);
    }
    async getMembers(roomId) {
        const members = await prisma_1.default.roomMember.findMany({
            where: { roomId },
            include: { user: { select: { nickname: true } } },
        });
        return members.map((m) => ({
            ...new RoomMember_1.RoomMember(m.id, m.roomId, m.userId, m.joinedAt),
            user: { nickname: m.user.nickname },
        }));
    }
    async getRoomsByUserId(userId) {
        const memberships = await prisma_1.default.roomMember.findMany({
            where: { userId },
            include: { room: true },
        });
        return memberships.map((m) => new Room_1.Room(m.room.id, m.room.name, m.room.inviteCode, m.room.password, m.room.createdAt, m.room.creatorId));
    }
    async isMember(roomId, userId) {
        const member = await prisma_1.default.roomMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        return !!member;
    }
    async updateName(roomId, name) {
        const room = await prisma_1.default.room.update({
            where: { id: roomId },
            data: { name },
        });
        return new Room_1.Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId);
    }
}
exports.PrismaRoomRepository = PrismaRoomRepository;
//# sourceMappingURL=PrismaRoomRepository.js.map
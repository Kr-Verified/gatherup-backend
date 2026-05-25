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
        return this.toDomain(room);
    }
    async findById(id) {
        const room = await prisma_1.default.room.findUnique({ where: { id } });
        if (!room)
            return null;
        return this.toDomain(room);
    }
    async findByInviteCode(inviteCode) {
        const room = await prisma_1.default.room.findUnique({ where: { inviteCode } });
        if (!room)
            return null;
        return this.toDomain(room);
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
            include: { user: { select: { nickname: true, profileImageUrl: true } } },
        });
        return members.map((m) => ({
            ...new RoomMember_1.RoomMember(m.id, m.roomId, m.userId, m.joinedAt),
            user: { nickname: m.user.nickname, profileImageUrl: m.user.profileImageUrl },
        }));
    }
    async getRoomsByUserId(userId) {
        const memberships = await prisma_1.default.roomMember.findMany({
            where: { userId },
            include: { room: true },
        });
        return memberships.map((m) => this.toDomain(m.room));
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
        return this.toDomain(room);
    }
    async updateSettings(roomId, data) {
        const room = await prisma_1.default.room.update({
            where: { id: roomId },
            data,
        });
        return this.toDomain(room);
    }
    toDomain(room) {
        return new Room_1.Room(room.id, room.name, room.inviteCode, room.password, room.createdAt, room.creatorId, room.nameColor, room.theme);
    }
}
exports.PrismaRoomRepository = PrismaRoomRepository;
//# sourceMappingURL=PrismaRoomRepository.js.map
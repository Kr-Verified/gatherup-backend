"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomUseCase = void 0;
const bcrypt = __importStar(require("bcryptjs"));
class RoomUseCase {
    roomRepo;
    scheduleRepo;
    constructor(roomRepo, scheduleRepo) {
        this.roomRepo = roomRepo;
        this.scheduleRepo = scheduleRepo;
    }
    async createRoom(name, password, creatorId) {
        const inviteCode = this.generateInviteCode();
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const room = await this.roomRepo.create(name, hashedPassword, inviteCode, creatorId);
        // Creator automatically joins the room
        await this.roomRepo.addMember(room.id, creatorId);
        return room;
    }
    async joinRoom(inviteCode, password, userId) {
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
    async getMyRooms(userId) {
        return this.roomRepo.getRoomsByUserId(userId);
    }
    async getRoomDetail(roomId) {
        const room = await this.roomRepo.findById(roomId);
        if (!room) {
            throw new Error('방을 찾을 수 없습니다.');
        }
        const members = await this.roomRepo.getMembers(roomId);
        return { room, members };
    }
    async assertMember(roomId, userId) {
        const isMember = await this.roomRepo.isMember(roomId, userId);
        if (!isMember) {
            throw new Error('방 멤버만 접근할 수 있습니다.');
        }
    }
    async updateRoomName(roomId, name, userId) {
        const room = await this.roomRepo.findById(roomId);
        if (!room) {
            throw new Error('방을 찾을 수 없습니다.');
        }
        if (room.creatorId !== userId) {
            throw new Error('방장만 방 이름을 수정할 수 있습니다.');
        }
        return this.roomRepo.updateName(roomId, name);
    }
    async getAvailableDates(roomId, startDate, endDate) {
        const members = await this.roomRepo.getMembers(roomId);
        const userIds = members.map((m) => m.userId);
        if (userIds.length === 0) {
            return [];
        }
        const schedules = await this.scheduleRepo.findByUserIds(userIds, startDate, endDate);
        const result = [];
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
                status: uniqueBusyUsers.length === 0
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
    generateInviteCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}
exports.RoomUseCase = RoomUseCase;
//# sourceMappingURL=RoomUseCase.js.map
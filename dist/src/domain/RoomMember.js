"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMember = void 0;
class RoomMember {
    id;
    roomId;
    userId;
    joinedAt;
    constructor(id, roomId, userId, joinedAt) {
        this.id = id;
        this.roomId = roomId;
        this.userId = userId;
        this.joinedAt = joinedAt;
    }
}
exports.RoomMember = RoomMember;
//# sourceMappingURL=RoomMember.js.map
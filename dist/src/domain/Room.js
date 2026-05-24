"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    id;
    name;
    inviteCode;
    password;
    createdAt;
    creatorId;
    constructor(id, name, inviteCode, password, createdAt, creatorId) {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
        this.password = password;
        this.createdAt = createdAt;
        this.creatorId = creatorId;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map
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
    nameColor;
    theme;
    constructor(id, name, inviteCode, password, createdAt, creatorId, nameColor = '#a78bfa', theme = 'midnight') {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
        this.password = password;
        this.createdAt = createdAt;
        this.creatorId = creatorId;
        this.nameColor = nameColor;
        this.theme = theme;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map
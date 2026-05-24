export class Room {
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
//# sourceMappingURL=Room.js.map
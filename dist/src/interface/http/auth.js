"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUserId = getAuthenticatedUserId;
exports.publicUser = publicUser;
exports.publicRoom = publicRoom;
const token_1 = require("../../infrastructure/auth/token");
function getAuthenticatedUserId(c) {
    const authHeader = c.req.header('Authorization');
    const match = authHeader?.match(/^Bearer\s+(.+)$/i);
    if (!match)
        return null;
    try {
        return (0, token_1.verifyAuthToken)(match[1]).sub;
    }
    catch {
        return null;
    }
}
function publicUser(user) {
    const { password: _password, ...safeUser } = user;
    return safeUser;
}
function publicRoom(room) {
    const { password, ...safeRoom } = room;
    return { ...safeRoom, hasPassword: !!password };
}
//# sourceMappingURL=auth.js.map
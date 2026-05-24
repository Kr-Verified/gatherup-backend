import { verifyAuthToken } from '../../infrastructure/auth/token';
export function getAuthenticatedUserId(c) {
    const authHeader = c.req.header('Authorization');
    const match = authHeader?.match(/^Bearer\s+(.+)$/i);
    if (!match)
        return null;
    try {
        return verifyAuthToken(match[1]).sub;
    }
    catch {
        return null;
    }
}
export function publicUser(user) {
    const { password: _password, ...safeUser } = user;
    return safeUser;
}
export function publicRoom(room) {
    const { password, ...safeRoom } = room;
    return { ...safeRoom, hasPassword: !!password };
}
//# sourceMappingURL=auth.js.map
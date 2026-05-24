export interface AuthTokenPayload {
    sub: string;
    nickname: string;
    iat: number;
    exp: number;
}
export declare function createAuthToken(user: {
    id: string;
    nickname: string;
}): string;
export declare function verifyAuthToken(token: string): AuthTokenPayload;
//# sourceMappingURL=token.d.ts.map
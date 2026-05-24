"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const token_1 = require("../../infrastructure/auth/token");
const auth_1 = require("../http/auth");
class AuthController {
    authUseCase;
    constructor(authUseCase) {
        this.authUseCase = authUseCase;
    }
    withTimeout(promise, ms, message) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error(message)), ms);
            promise
                .then(resolve)
                .catch(reject)
                .finally(() => clearTimeout(timeout));
        });
    }
    authResponse(user) {
        return {
            user: (0, auth_1.publicUser)(user),
            token: (0, token_1.createAuthToken)(user),
        };
    }
    register = async (c) => {
        try {
            const body = await c.req.json();
            const { nickname, age, gender, loginId, password } = body;
            if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
                return c.json({ error: '닉네임을 입력해주세요.' }, 400);
            }
            if (!loginId || !password) {
                return c.json({ error: '아이디와 비밀번호를 입력해주세요.' }, 400);
            }
            const user = await this.authUseCase.register(nickname.trim(), loginId, password, age, gender);
            return c.json(this.authResponse(user), 201);
        }
        catch (error) {
            return c.json({ error: error.message || 'Registration failed' }, 400);
        }
    };
    login = async (c) => {
        try {
            const body = await c.req.json();
            const { loginId, password } = body;
            if (!loginId || !password)
                return c.json({ error: '아이디와 비밀번호를 입력해주세요.' }, 400);
            const user = await this.authUseCase.login(loginId, password);
            return c.json(this.authResponse(user));
        }
        catch (error) {
            return c.json({ error: error.message }, 401);
        }
    };
    checkDuplicateId = async (c) => {
        try {
            const loginId = c.req.query('loginId');
            if (!loginId)
                return c.json({ error: '아이디를 입력해주세요.' }, 400);
            const isDuplicate = await this.authUseCase.checkDuplicateId(loginId);
            return c.json({ isDuplicate });
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    };
    googleLogin = async (c) => {
        try {
            const body = await c.req.json();
            const { accessToken } = body;
            if (!accessToken)
                return c.json({ error: '잘못된 요청입니다.' }, 400);
            const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
                signal: AbortSignal.timeout(5_000),
            });
            if (!googleRes.ok) {
                return c.json({ error: '구글 인증에 실패했습니다.' }, 401);
            }
            const userInfo = await googleRes.json();
            if (!userInfo.email) {
                return c.json({ error: '구글 계정 이메일을 확인할 수 없습니다.' }, 401);
            }
            const user = await this.withTimeout(this.authUseCase.googleLogin(userInfo.email, userInfo.name || '구글유저'), 7_000, '데이터베이스 연결 시간이 초과되었습니다.');
            return c.json(this.authResponse(user));
        }
        catch (error) {
            const status = error.message?.includes('초과') || error.name === 'TimeoutError' ? 504 : 500;
            return c.json({ error: error.message }, status);
        }
    };
    deleteAccount = async (c) => {
        try {
            const userId = (0, auth_1.getAuthenticatedUserId)(c);
            if (!userId)
                return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
            await this.authUseCase.deleteAccount(userId);
            return c.json({ success: true });
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    };
    getMe = async (c) => {
        try {
            const userId = (0, auth_1.getAuthenticatedUserId)(c);
            if (!userId) {
                return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
            }
            const user = await this.authUseCase.getUser(userId);
            if (!user) {
                return c.json({ error: '사용자를 찾을 수 없습니다.' }, 404);
            }
            return c.json((0, auth_1.publicUser)(user));
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map
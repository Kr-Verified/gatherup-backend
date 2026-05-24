import { Context } from 'hono';
import { AuthUseCase } from '../../usecase/auth/AuthUseCase';
import { createAuthToken } from '../../infrastructure/auth/token';
import { getAuthenticatedUserId, publicUser } from '../http/auth';

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  private authResponse(user: Awaited<ReturnType<AuthUseCase['login']>>) {
    return {
      user: publicUser(user),
      token: createAuthToken(user),
    };
  }

  register = async (c: Context) => {
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
    } catch (error: any) {
      return c.json({ error: error.message || 'Registration failed' }, 400);
    }
  };

  login = async (c: Context) => {
    try {
      const body = await c.req.json();
      const { loginId, password } = body;
      if (!loginId || !password) return c.json({ error: '아이디와 비밀번호를 입력해주세요.' }, 400);
      
      const user = await this.authUseCase.login(loginId, password);
      return c.json(this.authResponse(user));
    } catch (error: any) {
      return c.json({ error: error.message }, 401);
    }
  };

  checkDuplicateId = async (c: Context) => {
    try {
      const loginId = c.req.query('loginId');
      if (!loginId) return c.json({ error: '아이디를 입력해주세요.' }, 400);
      const isDuplicate = await this.authUseCase.checkDuplicateId(loginId);
      return c.json({ isDuplicate });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  };

  googleLogin = async (c: Context) => {
    try {
      const body = await c.req.json();
      const { accessToken } = body;
      if (!accessToken) return c.json({ error: '잘못된 요청입니다.' }, 400);

      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!googleRes.ok) {
        return c.json({ error: '구글 인증에 실패했습니다.' }, 401);
      }
      const userInfo = await googleRes.json() as { email?: string; name?: string };
      if (!userInfo.email) {
        return c.json({ error: '구글 계정 이메일을 확인할 수 없습니다.' }, 401);
      }

      const user = await this.authUseCase.googleLogin(userInfo.email, userInfo.name || '구글유저');
      return c.json(this.authResponse(user));
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  };

  deleteAccount = async (c: Context) => {
    try {
      const userId = getAuthenticatedUserId(c);
      if (!userId) return c.json({ error: '사용자 ID가 필요합니다.' }, 401);

      await this.authUseCase.deleteAccount(userId);
      return c.json({ success: true });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  };

  getMe = async (c: Context) => {
    try {
      const userId = getAuthenticatedUserId(c);
      if (!userId) {
        return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
      }
      const user = await this.authUseCase.getUser(userId);
      if (!user) {
        return c.json({ error: '사용자를 찾을 수 없습니다.' }, 404);
      }
      return c.json(publicUser(user));
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  };
}

import { Context } from 'hono';
import { verifyAuthToken } from '../../infrastructure/auth/token';

export function getAuthenticatedUserId(c: Context): string | null {
  const authHeader = c.req.header('Authorization');
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  try {
    return verifyAuthToken(match[1]).sub;
  } catch {
    return null;
  }
}

export function publicUser<T extends { password?: string | null }>(user: T): Omit<T, 'password'> {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function publicRoom<T extends { password?: string | null }>(room: T): Omit<T, 'password'> & { hasPassword: boolean } {
  const { password, ...safeRoom } = room;
  return { ...safeRoom, hasPassword: !!password };
}

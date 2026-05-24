import * as crypto from 'node:crypto';

export interface AuthTokenPayload {
  sub: string;
  nickname: string;
  iat: number;
  exp: number;
}

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters.');
  }
  return secret;
}

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

function base64UrlJson(value: unknown): string {
  return base64UrlEncode(JSON.stringify(value));
}

function sign(data: string): string {
  return crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64url');
}

export function createAuthToken(user: { id: string; nickname: string }): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: AuthTokenPayload = {
    sub: user.id,
    nickname: user.nickname,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const unsigned = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  return `${unsigned}.${sign(unsigned)}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token.');
  }

  const [header, payload, signature] = parts;
  const unsigned = `${header}.${payload}`;
  const expected = sign(unsigned);

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    throw new Error('Invalid token.');
  }

  const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AuthTokenPayload;
  if (!parsed.sub || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Invalid token.');
  }

  return parsed;
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthToken = createAuthToken;
exports.verifyAuthToken = verifyAuthToken;
const crypto = __importStar(require("node:crypto"));
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be set to at least 32 characters.');
    }
    return secret;
}
function base64UrlEncode(value) {
    return Buffer.from(value).toString('base64url');
}
function base64UrlJson(value) {
    return base64UrlEncode(JSON.stringify(value));
}
function sign(data) {
    return crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64url');
}
function createAuthToken(user) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        sub: user.id,
        nickname: user.nickname,
        iat: now,
        exp: now + TOKEN_TTL_SECONDS,
    };
    const unsigned = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
    return `${unsigned}.${sign(unsigned)}`;
}
function verifyAuthToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid token.');
    }
    const [header, payload, signature] = parts;
    const unsigned = `${header}.${payload}`;
    const expected = sign(unsigned);
    if (signature.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        throw new Error('Invalid token.');
    }
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed.sub || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Invalid token.');
    }
    return parsed;
}
//# sourceMappingURL=token.js.map
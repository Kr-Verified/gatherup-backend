import { Context } from 'hono';
import { AuthUseCase } from '../../usecase/auth/AuthUseCase';
export declare class AuthController {
    private authUseCase;
    constructor(authUseCase: AuthUseCase);
    private fetchWithTimeout;
    private withTimeout;
    private authResponse;
    register: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        user: {
            id: string;
            loginId?: string | null | undefined;
            provider: string;
            email?: string | null | undefined;
            nickname: string;
            age: number | null;
            gender: string | null;
            createdAt: string;
        };
        token: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 400, "json">)>;
    login: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        user: {
            id: string;
            loginId?: string | null | undefined;
            provider: string;
            email?: string | null | undefined;
            nickname: string;
            age: number | null;
            gender: string | null;
            createdAt: string;
        };
        token: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 401, "json">)>;
    checkDuplicateId: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        isDuplicate: boolean;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500, "json">)>;
    googleLogin: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        user: {
            id: string;
            loginId?: string | null | undefined;
            provider: string;
            email?: string | null | undefined;
            nickname: string;
            age: number | null;
            gender: string | null;
            createdAt: string;
        };
        token: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500 | 504, "json">)>;
    deleteAccount: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        success: true;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500, "json">)>;
    getMe: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        loginId?: string | null | undefined;
        provider: string;
        email?: string | null | undefined;
        nickname: string;
        age: number | null;
        gender: string | null;
        createdAt: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500, "json">)>;
}
//# sourceMappingURL=AuthController.d.ts.map
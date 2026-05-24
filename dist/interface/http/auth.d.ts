import { Context } from 'hono';
export declare function getAuthenticatedUserId(c: Context): string | null;
export declare function publicUser<T extends {
    password?: string | null;
}>(user: T): Omit<T, 'password'>;
export declare function publicRoom<T extends {
    password?: string | null;
}>(room: T): Omit<T, 'password'> & {
    hasPassword: boolean;
};
//# sourceMappingURL=auth.d.ts.map
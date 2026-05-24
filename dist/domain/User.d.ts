export declare class User {
    id: string;
    nickname: string;
    age: number | null;
    gender: string | null;
    createdAt: Date;
    loginId?: string | null | undefined;
    password?: string | null | undefined;
    provider: string;
    email?: string | null | undefined;
    constructor(id: string, nickname: string, age: number | null, gender: string | null, createdAt: Date, loginId?: string | null | undefined, password?: string | null | undefined, provider?: string, email?: string | null | undefined);
}
//# sourceMappingURL=User.d.ts.map
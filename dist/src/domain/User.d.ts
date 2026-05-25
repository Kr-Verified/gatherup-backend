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
    profileImageUrl?: string | null | undefined;
    theme: string;
    constructor(id: string, nickname: string, age: number | null, gender: string | null, createdAt: Date, loginId?: string | null | undefined, password?: string | null | undefined, provider?: string, email?: string | null | undefined, profileImageUrl?: string | null | undefined, theme?: string);
}
//# sourceMappingURL=User.d.ts.map
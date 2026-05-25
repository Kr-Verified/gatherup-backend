import { User } from '../../domain/User';
import { UserRepository } from '../../interface/repositories/UserRepository';
export declare class AuthUseCase {
    private userRepo;
    constructor(userRepo: UserRepository);
    checkDuplicateId(loginId: string): Promise<boolean>;
    register(nickname: string, loginId?: string, password?: string, age?: number, gender?: string): Promise<User>;
    login(loginId: string, password: string): Promise<User>;
    googleLogin(email: string, nickname: string): Promise<User>;
    getUser(id: string): Promise<User | null>;
    updateProfile(id: string, data: Partial<{
        nickname: string;
        profileImageUrl: string | null;
        theme: string;
    }>): Promise<User>;
    deleteAccount(id: string): Promise<void>;
}
//# sourceMappingURL=AuthUseCase.d.ts.map
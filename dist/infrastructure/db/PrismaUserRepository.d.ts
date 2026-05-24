import { UserRepository } from '../../interface/repositories/UserRepository';
import { User } from '../../domain/User';
export declare class PrismaUserRepository implements UserRepository {
    create(nickname: string, age?: number, gender?: string, loginId?: string, password?: string, provider?: string, email?: string): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByLoginId(loginId: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    deleteUser(id: string): Promise<void>;
}
//# sourceMappingURL=PrismaUserRepository.d.ts.map
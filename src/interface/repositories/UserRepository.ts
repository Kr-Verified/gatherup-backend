import { User } from '../../domain/User';

export interface UserRepository {
  create(nickname: string, age?: number, gender?: string, loginId?: string, password?: string, provider?: string, email?: string): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByLoginId(loginId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateProfile(id: string, data: Partial<{ nickname: string; profileImageUrl: string | null; theme: string }>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

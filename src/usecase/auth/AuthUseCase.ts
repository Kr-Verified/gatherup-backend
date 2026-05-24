import { User } from '../../domain/User';
import { UserRepository } from '../../interface/repositories/UserRepository';

import * as bcrypt from 'bcryptjs';

export class AuthUseCase {
  constructor(private userRepo: UserRepository) {}

  async checkDuplicateId(loginId: string): Promise<boolean> {
    const user = await this.userRepo.findByLoginId(loginId);
    return !!user;
  }

  async register(nickname: string, loginId?: string, password?: string, age?: number, gender?: string): Promise<User> {
    let hashedPassword = undefined;
    if (loginId && password) {
      const exists = await this.checkDuplicateId(loginId);
      if (exists) throw new Error('이미 사용 중인 아이디입니다.');
      hashedPassword = await bcrypt.hash(password, 10);
    }
    return this.userRepo.create(nickname, age, gender, loginId, hashedPassword, 'local', undefined);
  }

  async login(loginId: string, password: string): Promise<User> {
    const user = await this.userRepo.findByLoginId(loginId);
    if (!user || !user.password) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    return user;
  }

  async googleLogin(email: string, nickname: string): Promise<User> {
    let user = await this.userRepo.findByEmail(email);
    if (!user) {
      user = await this.userRepo.create(nickname, undefined, undefined, undefined, undefined, 'google', email);
    }
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async deleteAccount(id: string): Promise<void> {
    await this.userRepo.deleteUser(id);
  }
}

import { User } from '../../domain/User';
import { UserRepository } from '../../interface/repositories/UserRepository';
import {
  cleanText,
  validateLoginId,
  validateOptionalAge,
  validateOptionalGender,
  validatePassword,
  validateProfileImageUrl,
  validateTheme,
} from '../validation';

import * as bcrypt from 'bcryptjs';

export class AuthUseCase {
  constructor(private userRepo: UserRepository) {}

  async checkDuplicateId(loginId: string): Promise<boolean> {
    const user = await this.userRepo.findByLoginId(validateLoginId(loginId));
    return !!user;
  }

  async register(nickname: string, loginId?: string, password?: string, age?: number, gender?: string): Promise<User> {
    let hashedPassword = undefined;
    if (loginId && password) {
      loginId = validateLoginId(loginId);
      password = validatePassword(password);
      const exists = await this.checkDuplicateId(loginId);
      if (exists) throw new Error('이미 사용 중인 아이디입니다.');
      hashedPassword = await bcrypt.hash(password, 10);
    }
    return this.userRepo.create(
      cleanText(nickname, '닉네임', 32),
      validateOptionalAge(age),
      validateOptionalGender(gender),
      loginId,
      hashedPassword,
      'local',
      undefined
    );
  }

  async login(loginId: string, password: string): Promise<User> {
    const user = await this.userRepo.findByLoginId(validateLoginId(loginId));
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
      user = await this.userRepo.create(cleanText(nickname, '닉네임', 32), undefined, undefined, undefined, undefined, 'google', email);
    }
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async updateProfile(
    id: string,
    data: Partial<{ nickname: string; profileImageUrl: string | null; theme: string }>
  ): Promise<User> {
    const nextData: Partial<{ nickname: string; profileImageUrl: string | null; theme: string }> = {};
    if (data.nickname !== undefined) {
      nextData.nickname = cleanText(data.nickname, '닉네임', 32);
    }
    if (data.profileImageUrl !== undefined) nextData.profileImageUrl = validateProfileImageUrl(data.profileImageUrl);
    if (data.theme !== undefined) nextData.theme = validateTheme(data.theme);
    return this.userRepo.updateProfile(id, nextData);
  }

  async deleteAccount(id: string): Promise<void> {
    await this.userRepo.deleteUser(id);
  }
}

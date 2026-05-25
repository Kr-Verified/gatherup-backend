import { UserRepository } from '../../interface/repositories/UserRepository';
import { User } from '../../domain/User';
import prisma from './prisma';

export class PrismaUserRepository implements UserRepository {
  async create(nickname: string, age?: number, gender?: string, loginId?: string, password?: string, provider?: string, email?: string): Promise<User> {
    const user = await prisma.user.create({
      data: { 
        nickname, 
        age: age ?? null, 
        gender: gender ?? null,
        loginId: loginId ?? null,
        password: password ?? null,
        provider: provider ?? 'local',
        email: email ?? null
      },
    });
    return this.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByLoginId(loginId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { loginId } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async updateProfile(id: string, data: Partial<{ nickname: string; profileImageUrl: string | null; theme: string }>): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return this.toDomain(user);
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.schedule.deleteMany({ where: { userId: id } });
    await prisma.roomMember.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
  }

  private toDomain(user: {
    id: string;
    nickname: string;
    age: number | null;
    gender: string | null;
    createdAt: Date;
    loginId: string | null;
    password: string | null;
    provider: string;
    email: string | null;
    profileImageUrl: string | null;
    theme: string;
  }): User {
    return new User(
      user.id,
      user.nickname,
      user.age,
      user.gender,
      user.createdAt,
      user.loginId,
      user.password,
      user.provider,
      user.email,
      user.profileImageUrl,
      user.theme
    );
  }
}

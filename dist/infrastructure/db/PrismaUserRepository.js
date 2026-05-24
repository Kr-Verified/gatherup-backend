import { User } from '../../domain/User';
import prisma from './prisma';
export class PrismaUserRepository {
    async create(nickname, age, gender, loginId, password, provider, email) {
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
        return new User(user.id, user.nickname, user.age, user.gender, user.createdAt, user.loginId, user.password, user.provider, user.email);
    }
    async findById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        return new User(user.id, user.nickname, user.age, user.gender, user.createdAt, user.loginId, user.password, user.provider, user.email);
    }
    async findByLoginId(loginId) {
        const user = await prisma.user.findUnique({ where: { loginId } });
        if (!user)
            return null;
        return new User(user.id, user.nickname, user.age, user.gender, user.createdAt, user.loginId, user.password, user.provider, user.email);
    }
    async findByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        return new User(user.id, user.nickname, user.age, user.gender, user.createdAt, user.loginId, user.password, user.provider, user.email);
    }
    async deleteUser(id) {
        await prisma.schedule.deleteMany({ where: { userId: id } });
        await prisma.roomMember.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });
    }
}
//# sourceMappingURL=PrismaUserRepository.js.map
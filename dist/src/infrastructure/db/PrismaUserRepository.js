"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const User_1 = require("../../domain/User");
const prisma_1 = __importDefault(require("./prisma"));
class PrismaUserRepository {
    async create(nickname, age, gender, loginId, password, provider, email) {
        const user = await prisma_1.default.user.create({
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
    async findById(id) {
        const user = await prisma_1.default.user.findUnique({ where: { id } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async findByLoginId(loginId) {
        const user = await prisma_1.default.user.findUnique({ where: { loginId } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async findByEmail(email) {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async updateProfile(id, data) {
        const user = await prisma_1.default.user.update({
            where: { id },
            data,
        });
        return this.toDomain(user);
    }
    async deleteUser(id) {
        await prisma_1.default.schedule.deleteMany({ where: { userId: id } });
        await prisma_1.default.roomMember.deleteMany({ where: { userId: id } });
        await prisma_1.default.user.delete({ where: { id } });
    }
    toDomain(user) {
        return new User_1.User(user.id, user.nickname, user.age, user.gender, user.createdAt, user.loginId, user.password, user.provider, user.email, user.profileImageUrl, user.theme);
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
//# sourceMappingURL=PrismaUserRepository.js.map
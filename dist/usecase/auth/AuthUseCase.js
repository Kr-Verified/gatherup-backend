import * as bcrypt from 'bcryptjs';
export class AuthUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async checkDuplicateId(loginId) {
        const user = await this.userRepo.findByLoginId(loginId);
        return !!user;
    }
    async register(nickname, loginId, password, age, gender) {
        let hashedPassword = undefined;
        if (loginId && password) {
            const exists = await this.checkDuplicateId(loginId);
            if (exists)
                throw new Error('이미 사용 중인 아이디입니다.');
            hashedPassword = await bcrypt.hash(password, 10);
        }
        return this.userRepo.create(nickname, age, gender, loginId, hashedPassword, 'local', undefined);
    }
    async login(loginId, password) {
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
    async googleLogin(email, nickname) {
        let user = await this.userRepo.findByEmail(email);
        if (!user) {
            user = await this.userRepo.create(nickname, undefined, undefined, undefined, undefined, 'google', email);
        }
        return user;
    }
    async getUser(id) {
        return this.userRepo.findById(id);
    }
    async deleteAccount(id) {
        await this.userRepo.deleteUser(id);
    }
}
//# sourceMappingURL=AuthUseCase.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUseCase = void 0;
const bcrypt = __importStar(require("bcryptjs"));
class AuthUseCase {
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
exports.AuthUseCase = AuthUseCase;
//# sourceMappingURL=AuthUseCase.js.map
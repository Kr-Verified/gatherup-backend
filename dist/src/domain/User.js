"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    nickname;
    age;
    gender;
    createdAt;
    loginId;
    password;
    provider;
    email;
    profileImageUrl;
    theme;
    constructor(id, nickname, age, gender, createdAt, loginId, password, provider = 'local', email, profileImageUrl, theme = 'midnight') {
        this.id = id;
        this.nickname = nickname;
        this.age = age;
        this.gender = gender;
        this.createdAt = createdAt;
        this.loginId = loginId;
        this.password = password;
        this.provider = provider;
        this.email = email;
        this.profileImageUrl = profileImageUrl;
        this.theme = theme;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map
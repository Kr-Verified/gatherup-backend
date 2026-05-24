export class User {
    id;
    nickname;
    age;
    gender;
    createdAt;
    loginId;
    password;
    provider;
    email;
    constructor(id, nickname, age, gender, createdAt, loginId, password, provider = 'local', email) {
        this.id = id;
        this.nickname = nickname;
        this.age = age;
        this.gender = gender;
        this.createdAt = createdAt;
        this.loginId = loginId;
        this.password = password;
        this.provider = provider;
        this.email = email;
    }
}
//# sourceMappingURL=User.js.map
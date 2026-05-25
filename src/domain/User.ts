export class User {
  constructor(
    public id: string,
    public nickname: string,
    public age: number | null,
    public gender: string | null,
    public createdAt: Date,
    public loginId?: string | null,
    public password?: string | null,
    public provider: string = 'local',
    public email?: string | null,
    public profileImageUrl?: string | null,
    public theme: string = 'midnight'
  ) {}
}

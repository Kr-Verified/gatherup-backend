export class Room {
  constructor(
    public id: string,
    public name: string,
    public inviteCode: string,
    public password: string | null,
    public createdAt: Date,
    public creatorId: string,
    public nameColor: string = '#a78bfa',
    public theme: string = 'midnight'
  ) {}
}

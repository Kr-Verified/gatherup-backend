export class RoomMember {
  constructor(
    public id: string,
    public roomId: string,
    public userId: string,
    public joinedAt: Date
  ) {}
}

export class Schedule {
  constructor(
    public id: string,
    public userId: string,
    public startDate: Date,
    public endDate: Date,
    public title: string,
    public color: string | null,
    public createdAt: Date
  ) {}
}

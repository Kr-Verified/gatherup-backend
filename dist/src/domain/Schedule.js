"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
class Schedule {
    id;
    userId;
    startDate;
    endDate;
    title;
    color;
    createdAt;
    constructor(id, userId, startDate, endDate, title, color, createdAt) {
        this.id = id;
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.title = title;
        this.color = color;
        this.createdAt = createdAt;
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=Schedule.js.map
import { Room } from '../../domain/Room';
import { RoomMember } from '../../domain/RoomMember';
import { RoomRepository } from '../../interface/repositories/RoomRepository';
import { ScheduleRepository } from '../../interface/repositories/ScheduleRepository';
export interface DateAvailability {
    date: string;
    availableCount: number;
    totalCount: number;
    status: 'all-free' | 'some-busy' | 'all-busy';
    busyMembers: string[];
}
export declare class RoomUseCase {
    private roomRepo;
    private scheduleRepo;
    constructor(roomRepo: RoomRepository, scheduleRepo: ScheduleRepository);
    createRoom(name: string, password: string | null, creatorId: string): Promise<Room>;
    joinRoom(inviteCode: string, password: string | null, userId: string): Promise<Room>;
    getMyRooms(userId: string): Promise<Room[]>;
    getRoomDetail(roomId: string): Promise<{
        room: Room;
        members: (RoomMember & {
            user: {
                nickname: string;
                profileImageUrl: string | null;
            };
        })[];
    }>;
    assertMember(roomId: string, userId: string): Promise<void>;
    updateRoomName(roomId: string, name: string, userId: string): Promise<Room>;
    updateRoomSettings(roomId: string, data: Partial<{
        name: string;
        nameColor: string;
        theme: string;
    }>, userId: string): Promise<Room>;
    getAvailableDates(roomId: string, startDate: Date, endDate: Date): Promise<DateAvailability[]>;
    private generateInviteCode;
}
//# sourceMappingURL=RoomUseCase.d.ts.map
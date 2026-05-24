import { Room } from '../../domain/Room';
import { RoomMember } from '../../domain/RoomMember';
export interface RoomRepository {
    create(name: string, password: string | null, inviteCode: string, creatorId: string): Promise<Room>;
    findById(id: string): Promise<Room | null>;
    findByInviteCode(inviteCode: string): Promise<Room | null>;
    addMember(roomId: string, userId: string): Promise<RoomMember>;
    getMembers(roomId: string): Promise<(RoomMember & {
        user: {
            nickname: string;
        };
    })[]>;
    getRoomsByUserId(userId: string): Promise<Room[]>;
    isMember(roomId: string, userId: string): Promise<boolean>;
    updateName(roomId: string, name: string): Promise<Room>;
}
//# sourceMappingURL=RoomRepository.d.ts.map
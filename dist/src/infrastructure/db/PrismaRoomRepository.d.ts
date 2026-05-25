import { RoomRepository } from '../../interface/repositories/RoomRepository';
import { Room } from '../../domain/Room';
import { RoomMember } from '../../domain/RoomMember';
export declare class PrismaRoomRepository implements RoomRepository {
    create(name: string, password: string | null, inviteCode: string, creatorId: string): Promise<Room>;
    findById(id: string): Promise<Room | null>;
    findByInviteCode(inviteCode: string): Promise<Room | null>;
    addMember(roomId: string, userId: string): Promise<RoomMember>;
    getMembers(roomId: string): Promise<(RoomMember & {
        user: {
            nickname: string;
            profileImageUrl: string | null;
        };
    })[]>;
    getRoomsByUserId(userId: string): Promise<Room[]>;
    isMember(roomId: string, userId: string): Promise<boolean>;
    updateName(roomId: string, name: string): Promise<Room>;
    updateSettings(roomId: string, data: Partial<{
        name: string;
        nameColor: string;
        theme: string;
    }>): Promise<Room>;
    private toDomain;
}
//# sourceMappingURL=PrismaRoomRepository.d.ts.map
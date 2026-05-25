import { Context } from 'hono';
import { RoomUseCase } from '../../usecase/room/RoomUseCase';
export declare class RoomController {
    private roomUseCase;
    constructor(roomUseCase: RoomUseCase);
    createRoom: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        theme: string;
        id: string;
        createdAt: string;
        name: string;
        nameColor: string;
        inviteCode: string;
        creatorId: string;
        hasPassword: boolean;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500, "json">)>;
    joinRoom: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        theme: string;
        id: string;
        createdAt: string;
        name: string;
        nameColor: string;
        inviteCode: string;
        creatorId: string;
        hasPassword: boolean;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 400 | 403 | 404, "json">)>;
    listMyRooms: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        theme: string;
        id: string;
        createdAt: string;
        name: string;
        nameColor: string;
        inviteCode: string;
        creatorId: string;
        hasPassword: boolean;
    }[], import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500, "json">)>;
    getRoomDetail: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        room: {
            theme: string;
            id: string;
            createdAt: string;
            name: string;
            nameColor: string;
            inviteCode: string;
            creatorId: string;
            hasPassword: boolean;
        };
        members: {
            id: string;
            roomId: string;
            userId: string;
            joinedAt: string;
            user: {
                nickname: string;
                profileImageUrl: string | null;
            };
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 403 | 404, "json">)>;
    updateRoomName: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        theme: string;
        id: string;
        createdAt: string;
        name: string;
        nameColor: string;
        inviteCode: string;
        creatorId: string;
        hasPassword: boolean;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 400 | 403, "json">)>;
    updateRoomSettings: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        theme: string;
        id: string;
        createdAt: string;
        name: string;
        nameColor: string;
        inviteCode: string;
        creatorId: string;
        hasPassword: boolean;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 400 | 403, "json">)>;
    getAvailableDates: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        date: string;
        availableCount: number;
        totalCount: number;
        status: "all-free" | "some-busy" | "all-busy";
        busyMembers: string[];
    }[], import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: any;
    }, 500, "json">)>;
}
//# sourceMappingURL=RoomController.d.ts.map
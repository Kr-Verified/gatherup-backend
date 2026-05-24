import { Context } from 'hono';
import { RoomUseCase } from '../../usecase/room/RoomUseCase';
import { getAuthenticatedUserId, publicRoom } from '../http/auth';

export class RoomController {
  constructor(private roomUseCase: RoomUseCase) {}

  createRoom = async (c: Context) => {
    try {
      const userId = getAuthenticatedUserId(c);
      if (!userId) return c.json({ error: '사용자 ID가 필요합니다.' }, 401);

      const body = await c.req.json();
      const { name, password } = body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return c.json({ error: '방 이름을 입력해주세요.' }, 400);
      }

      const room = await this.roomUseCase.createRoom(name.trim(), password || null, userId);
      return c.json(publicRoom(room), 201);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  };

  joinRoom = async (c: Context) => {
    try {
      const userId = getAuthenticatedUserId(c);
      if (!userId) return c.json({ error: '사용자 ID가 필요합니다.' }, 401);

      const body = await c.req.json();
      const { inviteCode, password } = body;

      if (!inviteCode) {
        return c.json({ error: '초대 코드를 입력해주세요.' }, 400);
      }

      const room = await this.roomUseCase.joinRoom(inviteCode.toUpperCase(), password || null, userId);
      return c.json(publicRoom(room));
    } catch (error: any) {
      const status = error.message.includes('찾을 수 없') ? 404 : error.message.includes('비밀번호') ? 403 : 400;
      return c.json({ error: error.message }, status);
    }
  };

  listMyRooms = async (c: Context) => {
    try {
      const userId = getAuthenticatedUserId(c);
      if (!userId) return c.json({ error: '사용자 ID가 필요합니다.' }, 401);

      const rooms = await this.roomUseCase.getMyRooms(userId);
      return c.json(rooms.map(publicRoom));
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  };

  getRoomDetail = async (c: Context) => {
    try {
      const roomId = c.req.param('id')!;
      const userId = getAuthenticatedUserId(c);
      if (!userId) return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
      await this.roomUseCase.assertMember(roomId, userId);
      const detail = await this.roomUseCase.getRoomDetail(roomId);
      return c.json({ ...detail, room: publicRoom(detail.room) });
    } catch (error: any) {
      const status = error.message.includes('멤버') ? 403 : 404;
      return c.json({ error: error.message }, status);
    }
  };

  updateRoomName = async (c: Context) => {
    try {
      const userId = getAuthenticatedUserId(c);
      if (!userId) return c.json({ error: '사용자 ID가 필요합니다.' }, 401);

      const roomId = c.req.param('id')!;
      const body = await c.req.json();
      const { name } = body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return c.json({ error: '방 이름을 입력해주세요.' }, 400);
      }

      const room = await this.roomUseCase.updateRoomName(roomId, name.trim(), userId);
      return c.json(publicRoom(room));
    } catch (error: any) {
      const status = error.message.includes('방장') ? 403 : 400;
      return c.json({ error: error.message }, status);
    }
  };

  getAvailableDates = async (c: Context) => {
    try {
      const roomId = c.req.param('id')!;
      const userId = getAuthenticatedUserId(c);
      if (!userId) return c.json({ error: '사용자 ID가 필요합니다.' }, 401);
      await this.roomUseCase.assertMember(roomId, userId);
      const startDate = c.req.query('startDate');
      const endDate = c.req.query('endDate');

      if (!startDate || !endDate) {
        return c.json({ error: 'startDate와 endDate를 입력해주세요.' }, 400);
      }

      const result = await this.roomUseCase.getAvailableDates(
        roomId,
        new Date(startDate),
        new Date(endDate)
      );
      return c.json(result);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  };
}

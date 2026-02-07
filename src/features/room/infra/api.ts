import { apiClient } from '@/lib/open-api'
import { RoomRepository } from '../domain/room.repository'

export class RoomApi implements RoomRepository {
  // ルームの作成者を取得する
  public async getRoomCreatorId(roomId: string): Promise<string> {
    const res = await apiClient.rooms.getRoomCreator({ id: roomId })
    return res.createdBy
  }
}

export interface RoomRepository {
  getRoomCreatorId(roomId: string): Promise<string>
}

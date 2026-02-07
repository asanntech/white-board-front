import { useQuery } from '@tanstack/react-query'
import { RoomApi } from '../api'
import { useUserStore } from '@/stores'
import { RoomRepository } from '../domain'

type UseRoomCreatorResult = {
  createdByUserId: string
  isRoomCreator: boolean
}

export const useRoomCreator = (roomId: string) => {
  const roomApi: RoomRepository = new RoomApi()

  const userId = useUserStore((s) => s.userId)

  return useQuery<UseRoomCreatorResult, Error>({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const createdByUserId = await roomApi.getRoomCreatorId(roomId)
      return { createdByUserId, isRoomCreator: createdByUserId === userId }
    },
    enabled: !!roomId && !!userId,
  })
}

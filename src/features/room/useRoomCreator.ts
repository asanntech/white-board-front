import { useQuery } from '@tanstack/react-query'
import { RoomApi } from './api'
import { useAtomValue } from 'jotai'
import { userIdAtom } from '@/atoms'

type UseRoomCreatorResult = {
  createdByUserId: string
  isRoomCreator: boolean
}

export const useRoomCreator = (roomId: string) => {
  const roomApi = new RoomApi()

  const userId = useAtomValue(userIdAtom)

  return useQuery<UseRoomCreatorResult, Error>({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const createdByUserId = await roomApi.getRoomCreatorId(roomId)
      return { createdByUserId, isRoomCreator: createdByUserId === userId }
    },
    enabled: !!roomId && !!userId,
  })
}

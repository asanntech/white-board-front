import { useSetAtom, useAtomValue } from 'jotai'
import {
  socketAtom,
  roomIdAtom,
  socketConnectionAtom,
  socketErrorAtom,
  initializeSocketAtom,
  disconnectSocketAtom,
} from '../atoms/socketAtom'

export const useSocketManager = () => {
  const socket = useAtomValue(socketAtom)
  const roomId = useAtomValue(roomIdAtom)
  const isConnected = useAtomValue(socketConnectionAtom)
  const error = useAtomValue(socketErrorAtom)
  const initializeSocket = useSetAtom(initializeSocketAtom)
  const disconnectSocket = useSetAtom(disconnectSocketAtom)

  return {
    socket,
    roomId,
    isConnected,
    error,
    initializeSocket,
    disconnectSocket,
  }
}

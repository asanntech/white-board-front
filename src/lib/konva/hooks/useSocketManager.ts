import { useSetAtom, useAtomValue } from 'jotai'
import {
  socketAtom,
  socketConnectionAtom,
  socketErrorAtom,
  initializeSocketAtom,
  disconnectSocketAtom,
} from '../atoms/socketAtom'

// Socket接続を管理
export const useSocketManager = () => {
  const socket = useAtomValue(socketAtom)
  const isConnected = useAtomValue(socketConnectionAtom)
  const error = useAtomValue(socketErrorAtom)
  const initializeSocket = useSetAtom(initializeSocketAtom)
  const disconnectSocket = useSetAtom(disconnectSocketAtom)

  return {
    socket,
    isConnected,
    error,
    initializeSocket,
    disconnectSocket,
  }
}

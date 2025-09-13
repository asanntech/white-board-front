import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { socketConnectionAtom, initializeSocketAtom, disconnectSocketAtom, socketErrorAtom } from '../atoms/socketAtom'

export const SocketProvider = ({ children, roomId }: { children: React.ReactNode; roomId: string }) => {
  const isConnected = useAtomValue(socketConnectionAtom)
  const initializeSocket = useSetAtom(initializeSocketAtom)
  const disconnectSocket = useSetAtom(disconnectSocketAtom)
  const socketError = useAtomValue(socketErrorAtom)

  useEffect(() => {
    initializeSocket(roomId)

    return () => {
      disconnectSocket()
    }
  }, [roomId, initializeSocket, disconnectSocket])

  if (socketError) {
    throw new Error(socketError)
  }

  if (!isConnected) {
    return <p>接続中...</p>
  }

  return <>{children}</>
}

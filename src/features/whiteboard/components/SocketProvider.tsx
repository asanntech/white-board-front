import { useEffect } from 'react'
import { useWhiteboardStore } from '../stores'
import { AuthApi } from '@/features/auth/infra'

export const SocketProvider = ({ children, roomId }: { children: React.ReactNode; roomId: string }) => {
  const isConnected = useWhiteboardStore((s) => s.isConnected)
  const initializeSocket = useWhiteboardStore((s) => s.initializeSocket)
  const disconnectSocket = useWhiteboardStore((s) => s.disconnectSocket)
  const socketError = useWhiteboardStore((s) => s.socketError)

  useEffect(() => {
    const init = async () => {
      const authApi = new AuthApi()
      const token = await authApi.getToken()
      if (!token.hasToken) throw new Error('No token found')
      initializeSocket(roomId, token.accessToken)
    }

    init()

    return () => {
      disconnectSocket()
    }
  }, [roomId, initializeSocket, disconnectSocket])

  if (socketError) {
    throw new Error(socketError)
  }

  if (!isConnected) return <></>

  return <>{children}</>
}

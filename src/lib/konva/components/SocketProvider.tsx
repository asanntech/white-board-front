import { useEffect } from 'react'
import { useKonvaStore } from '@/stores/konva'
import { AuthApi } from '@/features/auth/api'

export const SocketProvider = ({ children, roomId }: { children: React.ReactNode; roomId: string }) => {
  const isConnected = useKonvaStore((s) => s.isConnected)
  const initializeSocket = useKonvaStore((s) => s.initializeSocket)
  const disconnectSocket = useKonvaStore((s) => s.disconnectSocket)
  const socketError = useKonvaStore((s) => s.socketError)

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

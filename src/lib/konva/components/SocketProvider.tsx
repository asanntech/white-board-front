import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { socketConnectionAtom, initializeSocketAtom, disconnectSocketAtom, socketErrorAtom } from '../atoms/socketAtom'
import { AuthApi } from '@/features/auth/api'

// Socket.ioの接続管理とYjsの同期処理をUIから分離するためのProvider
// 接続確立後にchildrenをレンダリングすることで、子コンポーネントは接続状態を意識せず描画処理に集中できる
export const SocketProvider = ({ children, roomId }: { children: React.ReactNode; roomId: string }) => {
  const isConnected = useAtomValue(socketConnectionAtom)
  const initializeSocket = useSetAtom(initializeSocketAtom)
  const disconnectSocket = useSetAtom(disconnectSocketAtom)
  const socketError = useAtomValue(socketErrorAtom)

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

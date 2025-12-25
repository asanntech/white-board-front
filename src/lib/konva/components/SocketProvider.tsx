import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { yjsConnectionAtom, initYjsAtom, disconnectYjsAtom, yjsErrorAtom } from '@/lib/yjs'
import { AuthApi } from '@/features/auth/api'

export const SocketProvider = ({ children, roomId }: { children: React.ReactNode; roomId: string }) => {
  const isConnected = useAtomValue(yjsConnectionAtom)
  const initializeYjs = useSetAtom(initYjsAtom)
  const disconnectYjs = useSetAtom(disconnectYjsAtom)
  const yjsError = useAtomValue(yjsErrorAtom)

  useEffect(() => {
    const init = async () => {
      const authApi = new AuthApi()
      const token = await authApi.getToken()
      if (!token.hasToken) throw new Error('No token found')
      initializeYjs(roomId, token.accessToken)
    }

    init()

    return () => {
      disconnectYjs()
    }
  }, [roomId, initializeYjs, disconnectYjs])

  if (yjsError) {
    throw new Error(yjsError)
  }

  if (!isConnected) return <></>

  return <>{children}</>
}

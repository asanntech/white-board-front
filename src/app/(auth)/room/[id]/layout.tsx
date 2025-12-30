'use client'

import { useParams } from 'next/navigation'
import { SocketProvider, YjsProvider } from '@/lib/konva/components'

interface Props {
  children: React.ReactNode
}

export default function RoomIdLayout({ children }: Props) {
  const params = useParams()

  if (!params?.id) return null

  return (
    <SocketProvider roomId={params.id as string}>
      <YjsProvider>{children}</YjsProvider>
    </SocketProvider>
  )
}



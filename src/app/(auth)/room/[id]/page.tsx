'use client'

import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
import { useDeleteTokenMutation } from '@/features/auth'
import { isReadyCanvasAtom } from '@/lib/konva/atoms'
import { SocketProvider } from '@/lib/konva/components'
import { signOutUrl } from '@/shared/constants'
import { useAtomValue } from 'jotai'
import { apiClient } from '@/lib/open-api'
import { userAtom } from '@/atoms'

const WhiteBoard = dynamic(() => import('@/lib/konva').then((mod) => mod.WhiteBoard), {
  ssr: false,
})

export default function MyRoomPage() {
  const { mutate: deleteTokenMutate } = useDeleteTokenMutation({
    onSuccess: () => {
      router.replace(signOutUrl)
    },
  })

  const isReadyCanvas = useAtomValue(isReadyCanvasAtom)
  const user = useAtomValue(userAtom)

  const router = useRouter()
  const params = useParams()

  const createRoom = () => {
    if (!user?.id) return

    apiClient.rooms.createRoom({
      requestBody: {
        name: 'My Room',
        createdBy: user.id,
      },
    })
  }

  if (!params?.id) {
    router.replace('/')
    return
  }

  return (
    <SocketProvider roomId={params.id as string}>
      <div className="relative">
        {isReadyCanvas && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-1 flex gap-10">
            <button
              className="bg-emerald-500 w-30 px-3 py-1 shadow-2xl rounded-2xl text-white text-center font-bold cursor-pointer hover:opacity-70"
              onClick={() => deleteTokenMutate()}
            >
              Sign Out
            </button>
            <button
              className="bg-blue-500 w-50 px-3 py-1 shadow-2xl rounded-2xl text-white text-center font-bold cursor-pointer hover:opacity-70"
              onClick={createRoom}
            >
              Create Room
            </button>
          </div>
        )}
        <WhiteBoard />
      </div>
    </SocketProvider>
  )
}

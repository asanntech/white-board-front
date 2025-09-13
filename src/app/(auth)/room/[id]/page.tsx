'use client'

import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
import { useDeleteTokenMutation } from '@/features/auth'
import { isReadyCanvasAtom } from '@/lib/konva/atoms'
import { SocketProvider } from '@/lib/konva/components'
import { signOutUrl } from '@/shared/constants'
import { useAtomValue } from 'jotai'

const WhiteBoard = dynamic(() => import('@/lib/konva').then((mod) => mod.WhiteBoard), {
  ssr: false,
})

export default function RoomPage() {
  const { mutate: deleteTokenMutate } = useDeleteTokenMutation({
    onSuccess: () => {
      router.replace(signOutUrl)
    },
  })

  const isReadyCanvas = useAtomValue(isReadyCanvasAtom)

  const router = useRouter()
  const params = useParams()

  if (!params?.id) {
    router.replace('/')
    return
  }

  return (
    <SocketProvider roomId={params.id as string}>
      <div className="relative">
        {isReadyCanvas && (
          <button
            className="absolute top-5 left-1/2 -translate-x-1/2 bg-emerald-500 w-30 px-3 py-1 shadow-2xl rounded-2xl text-white text-center font-bold cursor-pointer hover:opacity-70 z-1"
            onClick={() => deleteTokenMutate()}
          >
            Sign Out
          </button>
        )}
        <WhiteBoard />
      </div>
    </SocketProvider>
  )
}

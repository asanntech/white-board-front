'use client'

import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
import { useDeleteTokenMutation } from '@/features/auth'
import { isReadyCanvasAtom } from '@/lib/konva/atoms'
import { SocketProvider } from '@/lib/konva/components'
import { signOutUrl } from '@/shared/constants'
import { useAtomValue } from 'jotai'
import { IconButton } from '@/components/button'
import { SignOutIcon } from '@/components/icons'

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
          <>
            <button className="fixed z-1 left-5 top-5 bg-emerald-500 w-20 h-10 px-2 py-1 shadow-2xl rounded-md text-sm text-white text-center font-bold shadow-md cursor-pointer hover:opacity-70">
              共有
            </button>
            <div className="fixed z-1 right-5 top-5 flex gap-2 bg-white rounded-md p-1 shadow-md">
              <IconButton icon={<SignOutIcon />} onClick={deleteTokenMutate} />
            </div>
          </>
        )}
        <WhiteBoard />
      </div>
    </SocketProvider>
  )
}

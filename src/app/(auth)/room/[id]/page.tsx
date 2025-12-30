'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDeleteTokenMutation } from '@/features/auth'
import { useRoomCreator } from '@/features/room'
import { isReadyCanvasAtom } from '@/lib/konva/atoms'
import { signOutUrl } from '@/shared/constants'
import { useAtomValue } from 'jotai'
import { IconButton } from '@/components/button'
import { SignOutIcon } from '@/components/icons'
import { Toast } from '@/components/toast'
import { twMerge } from 'tailwind-merge'

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

  const { data: roomCreator, isLoading: isLoadingRoomCreator } = useRoomCreator(String(params.id))

  const [showToast, setShowToast] = useState(false)

  const copyLink = async () => {
    const base = process.env.NEXT_PUBLIC_WHITE_BOARD_URI ?? window.location.origin
    const roomId = String(params.id)
    const url = `${base}/room/${roomId}`
    await navigator.clipboard.writeText(url)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  if (!params?.id) {
    router.replace('/')
    return
  }

  return (
    <div className="relative">
      {isReadyCanvas && !isLoadingRoomCreator && (
        <>
          <button
            className={twMerge(
              'fixed z-1 left-5 top-5 w-20 h-10 px-2 py-1 shadow-md rounded-md text-sm text-white text-center font-bold',
              roomCreator?.isRoomCreator ? 'bg-emerald-500 cursor-pointer hover:opacity-70' : 'bg-gray-500'
            )}
            disabled={!roomCreator?.isRoomCreator}
            onClick={copyLink}
          >
            {roomCreator?.isRoomCreator ? '共有' : '参加中'}
          </button>
          <div className="fixed z-1 right-5 top-5 flex gap-2 bg-white rounded-md p-1 shadow-md">
            <IconButton icon={<SignOutIcon />} onClick={deleteTokenMutate} />
          </div>
        </>
      )}
      <WhiteBoard />
      <Toast showToast={showToast} toastMessage="共有リンクをコピーしました" />
    </div>
  )
}

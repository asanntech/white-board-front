'use client'

import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
// import { useDeleteTokenMutation } from '@/features/auth'
import { SocketProvider } from '@/lib/konva/components'

// const logoutUrl =
//   `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
//   `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
//   `&logout_uri=${process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI}`

const WhiteBoard = dynamic(() => import('@/lib/konva').then((mod) => mod.WhiteBoard), {
  ssr: false,
})

export default function RoomPage() {
  // const { mutate: deleteTokenMutate } = useDeleteTokenMutation({
  //   onSuccess: () => {
  //     router.replace(logoutUrl)
  //   },
  // })

  const router = useRouter()
  const params = useParams()

  if (!params?.id) {
    router.replace('/')
    return
  }

  return (
    // <div>
    //   <p>Hello!</p>
    //   <div onClick={() => deleteTokenMutate()}>Sign Out</div>
    // </div>
    <SocketProvider roomId={params.id as string}>
      <WhiteBoard />
    </SocketProvider>
  )
}

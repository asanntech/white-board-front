'use client'

import { useRouter } from 'next/navigation'
import { useDeleteTokenMutation } from '@/features/auth'

const logoutUrl =
  `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
  `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
  `&logout_uri=${process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI}`

export default function RoomPage() {
  const router = useRouter()

  const { mutate: deleteTokenMutate } = useDeleteTokenMutation({
    onSuccess: () => {
      router.replace(logoutUrl)
    },
  })

  return (
    <div>
      <p>Hello!</p>
      <div onClick={() => deleteTokenMutate()}>Sign Out</div>
    </div>
  )
}

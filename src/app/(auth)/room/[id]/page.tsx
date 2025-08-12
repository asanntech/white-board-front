'use client'

import { useRouter } from 'next/navigation'
import { useTokenStore } from '@/hooks'

const logoutUrl =
  `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
  `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
  `&logout_uri=${process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI}`

export default function RoomPage() {
  const router = useRouter()

  const { removeTokenStore } = useTokenStore()

  return (
    <div>
      <p>Hello!</p>
      <div
        onClick={() => {
          removeTokenStore()
          router.replace(logoutUrl)
        }}
      >
        Sign Out
      </div>
    </div>
  )
}

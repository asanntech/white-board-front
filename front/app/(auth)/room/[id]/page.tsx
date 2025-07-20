'use client'

import { useRouter } from 'next/navigation'
import { STORAGE_KEYS } from '@/constants/storageKeys'

const logoutUrl =
  `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
  `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
  `&logout_uri=${process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI}`

export default function RoomPage() {
  const router = useRouter()

  return (
    <div>
      <p>Hello!</p>
      <div
        onClick={() => {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          router.replace(logoutUrl)
        }}
      >
        Sign Out
      </div>
      <div
        onClick={() => {
          const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
          fetch('http://localhost:4000', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        }}
      >
        Get Message
      </div>
    </div>
  )
}

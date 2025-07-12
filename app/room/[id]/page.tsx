'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function RoomPage() {
  const router = useRouter()

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      return router.push('/')
    }
  }, [router, status])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return <></>
  }

  return (
    <div>
      <p>{session?.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useLocalStorageState from 'use-local-storage-state'
import { STORAGE_KEYS } from '@/shared/utils'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const [isAuth, setIsAuth] = useState(false)

  const router = useRouter()

  const [accessToken] = useLocalStorageState(STORAGE_KEYS.ACCESS_TOKEN, {})

  useEffect(() => {
    if (!accessToken) {
      router.replace('/')
      return
    }

    setIsAuth(true)
  }, [router, accessToken])

  return isAuth ? children : <p>Loading...</p>
}

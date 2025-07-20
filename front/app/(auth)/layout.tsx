'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { STORAGE_KEYS } from '@/constants'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const [isAuth, setIsAuth] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (!accessToken) {
      router.replace('/')
      return
    }

    setIsAuth(true)
  }, [pathname, router])

  return isAuth ? children : <p>Loading...</p>
}

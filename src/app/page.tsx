'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetTokenQuery } from '@/features/auth'

const loginUrl =
  `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize` +
  `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
  `&response_type=code` +
  `&scope=openid+email+profile` +
  `&redirect_uri=${process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI}` +
  `&lang=ja`

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Contents />
    </QueryClientProvider>
  )
}

const Contents = () => {
  const router = useRouter()

  const { data: token, isLoading: isTokenLoading } = useGetTokenQuery()

  useEffect(() => {
    if (isTokenLoading) return

    if (token?.hasToken) {
      router.replace('/room/1')
    }
  }, [router, token?.hasToken, isTokenLoading])

  if (isTokenLoading || token?.hasToken) return <p>Loading...</p>

  return <a href={loginUrl}>Sign in with Cognito</a>
}

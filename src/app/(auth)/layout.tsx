'use client'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useVerifyMutation } from '@/features/auth'
import { useTokenStore } from '@/hooks'

interface Props {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function AuthLayout({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Contents>{children}</Contents>
    </QueryClientProvider>
  )
}

const Contents = ({ children }: Props) => {
  const router = useRouter()

  const { tokenStore, isLoading: isTokenStoreLoading } = useTokenStore()

  const {
    mutate: verifyMutate,
    isError,
    isPending: isVerifyPending,
  } = useVerifyMutation({
    onError: () => {
      router.replace('/error')
    },
  })

  useEffect(() => {
    if (isTokenStoreLoading) return

    // トークンが存在しない場合はリダイレクト
    if (!tokenStore) {
      router.replace('/')
      return
    }

    verifyMutate({ idToken: tokenStore.idToken })
  }, [router, tokenStore, isTokenStoreLoading, verifyMutate])

  if (isTokenStoreLoading || isVerifyPending) return <p>Loading...</p>

  if (isError) return <p>Error</p>

  return children
}

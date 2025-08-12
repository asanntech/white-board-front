'use client'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import { useVerifyMutation } from '@/features/auth'
import { useTokenStore } from '@/hooks'
import { ErrorFallback } from '@/components/error'

interface Props {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function AuthLayout({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Contents>{children}</Contents>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

const Contents = ({ children }: Props) => {
  const router = useRouter()

  const { showBoundary } = useErrorBoundary()

  const { tokenStore, isLoading: isTokenStoreLoading } = useTokenStore()

  const {
    mutate: verifyMutate,
    data: isVerifySuccess,
    isPending: isVerifyPending,
  } = useVerifyMutation({
    onError: (err) => {
      showBoundary({ ...err, status: 401 })
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
  }, [isTokenStoreLoading, tokenStore, router, verifyMutate])

  if (isTokenStoreLoading || isVerifyPending) return <p>Loading...</p>

  if (!isVerifySuccess) return null

  return children
}

'use client'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import { useGetTokenQuery, useVerifyMutation } from '@/features/auth'
import { ErrorFallback } from '@/components/error'
import { useSetAtom } from 'jotai'
import { userAtom } from '@/atoms'

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

  const { data: token, isLoading: isTokenLoading } = useGetTokenQuery()

  const setUser = useSetAtom(userAtom)

  const {
    mutate: verifyMutate,
    data: verifyData,
    isPending: isVerifyPending,
  } = useVerifyMutation({
    onSuccess: (user) => {
      setUser(user)
      router.replace(`/room/${user.id}`)
    },
    onError: (err) => {
      showBoundary({ ...err, status: 401 })
    },
  })

  useEffect(() => {
    if (isTokenLoading) return

    // トークンが存在しない場合はリダイレクト
    if (!token?.hasToken) {
      router.replace('/')
      return
    }

    verifyMutate({ idToken: token.idToken })
  }, [isTokenLoading, router, token, verifyMutate])

  if (isVerifyPending) return <p>Loading...</p>

  if (!verifyData) return null

  return children
}

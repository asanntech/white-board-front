'use client'

import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { useAuthSession } from '@/features/auth'
import { ErrorFallback } from '@/components/error'
import { Loading } from '@/components/loading'
import { queryClient } from '@/lib/react-query'
import { useMinLoadingTime } from '@/hooks'

interface Props {
  children: React.ReactNode
}

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
  const isMinTimeElapsed = useMinLoadingTime()

  const { data: authData, isLoading: isAuthLoading } = useAuthSession()

  useEffect(() => {
    if (isAuthLoading || !isMinTimeElapsed) return

    // トークンが存在しない場合はリダイレクト
    if (!authData?.hasToken) {
      router.replace('/')
    } else {
      router.replace(`/room/${authData.roomId}`)
    }
  }, [isAuthLoading, router, authData, isMinTimeElapsed])

  if (isAuthLoading || !authData?.hasToken || !isMinTimeElapsed) return <Loading />

  return children
}

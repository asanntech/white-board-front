'use client'

import { useEffect, Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
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
        <Suspense fallback={<Loading />}>
          <Contents>{children}</Contents>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

const Contents = ({ children }: Props) => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const isMinTimeElapsed = useMinLoadingTime()

  const { data: authData, isLoading: isAuthLoading } = useAuthSession()

  useEffect(() => {
    if (isAuthLoading || !isMinTimeElapsed) return

    // トークンが存在しない場合はリダイレクト
    if (!authData?.hasToken) {
      // 未ログインで[id]が存在する場合（共有ページ）は、ディープリンクでリダイレクト
      const href = params.id ? `/?next=/room/${params.id}` : '/'
      router.replace(href)
      return
    }

    // [id]が存在する場合はそのroomにリダイレクト
    if (params.id) {
      router.replace(`/room/${params.id}`)
      return
    }

    // 自分のroomにリダイレクト
    router.replace(`/room/${authData.roomId}`)
  }, [isAuthLoading, router, authData, isMinTimeElapsed, searchParams, params.id])

  if (isAuthLoading || !authData?.hasToken || !isMinTimeElapsed) return <Loading />

  return children
}

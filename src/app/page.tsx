'use client'

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAuthSession } from '@/features/auth'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/error'
import { MainMenu } from '@/components/menu'
import { Loading } from '@/components/loading'
import { IconButton } from '@/components/button'
import { SignInIcon } from '@/components/icons'
import { Toast } from '@/components/toast'
import { signInUrl } from '@/shared/constants'
import { queryClient } from '@/lib/react-query'
import { useMinLoadingTime } from '@/hooks'

const WhiteBoard = dynamic(() => import('@/lib/konva').then((mod) => mod.WhiteBoard), {
  ssr: false,
})

const YjsProvider = dynamic(() => import('@/lib/konva/components').then((mod) => mod.YjsProvider), {
  ssr: false,
})

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <Contents />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

const Contents = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMinTimeElapsed = useMinLoadingTime()

  const { data: authData, isLoading: isAuthLoading } = useAuthSession()

  // ログインしていれば自分のroomにリダイレクト
  useEffect(() => {
    if (!isAuthLoading && authData?.hasToken && isMinTimeElapsed) {
      router.replace(`/room/${authData.roomId}`)
    }
  }, [router, authData, isAuthLoading, isMinTimeElapsed])

  const [selectedFreeTrial, setSelectedFreeTrial] = useState(false)

  // リダイレクト先がで指定されていればトーストを表示
  const showToast = useMemo(() => {
    return !!searchParams.get('next')
  }, [searchParams])

  // リダイレクト先が指定されていればそのページにリダイレクト
  const signInUrlWithRedirectPath = useMemo(() => {
    const next = searchParams.get('next')
    return signInUrl + `${next ? `&state=${next}` : ''}`
  }, [searchParams])

  const signIn = useCallback(() => {
    window.location.href = signInUrlWithRedirectPath
  }, [signInUrlWithRedirectPath])

  if (isAuthLoading || authData?.hasToken || !isMinTimeElapsed) return <Loading />

  return (
    <YjsProvider>
      <div className="relative">
        {!selectedFreeTrial && (
          <div className="absolute top-0 left-0 w-dvw h-dvh bg-stone-900/50 z-10">
            <MainMenu signInUrl={signInUrlWithRedirectPath} onClickFreeTrial={() => setSelectedFreeTrial(true)} />
          </div>
        )}
        {selectedFreeTrial && (
          <div className="fixed z-1 right-5 top-5 flex gap-2 bg-white rounded-md p-1 shadow-md">
            <IconButton icon={<SignInIcon />} onClick={signIn} />
          </div>
        )}
        <WhiteBoard />
        <div className="relative z-10">
          <Toast showToast={showToast} toastMessage="SignInが必要です" />
        </div>
      </div>
    </YjsProvider>
  )
}

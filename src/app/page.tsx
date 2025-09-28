'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAuthSession } from '@/features/auth'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/error'
import { MainMenu } from '@/components/menu'
import { Loading } from '@/components/loading'
import { signInUrl } from '@/shared/constants'
import { queryClient } from '@/lib/react-query'
import { useMinLoadingTime } from '@/hooks'

const WhiteBoard = dynamic(() => import('@/lib/konva').then((mod) => mod.WhiteBoard), {
  ssr: false,
})

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Contents />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

const Contents = () => {
  const router = useRouter()
  const isMinTimeElapsed = useMinLoadingTime()

  const { data: authData, isLoading: isAuthLoading } = useAuthSession()

  useEffect(() => {
    if (!isAuthLoading && authData?.hasToken && isMinTimeElapsed) {
      router.replace(`/room/${authData.roomId}`)
    }
  }, [router, authData, isAuthLoading, isMinTimeElapsed])

  const [selectedFreeTrial, setSelectedFreeTrial] = useState(false)

  if (isAuthLoading || authData?.hasToken || !isMinTimeElapsed) return <Loading />

  return (
    <div className="relative">
      {!selectedFreeTrial && (
        <div className="absolute top-0 left-0 w-dvw h-dvh bg-stone-900/50 z-10">
          <MainMenu onClickFreeTrial={() => setSelectedFreeTrial(true)} />
        </div>
      )}
      <WhiteBoard />
      {selectedFreeTrial && (
        <a
          href={signInUrl}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 w-30 px-3 py-1 shadow-2xl rounded-2xl text-white text-center font-bold cursor-pointer hover:opacity-70"
        >
          Sign In
        </a>
      )}
    </div>
  )
}

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useAuthSession } from './useAuthSession'
import { useUserStore } from '@/stores'
import { AuthApi } from '../infra'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
  return Wrapper
}

describe('useAuthSession', () => {
  beforeEach(() => {
    AuthApi.resetCache()
    useUserStore.setState({ userId: undefined })
  })

  it('トークンが有効な場合、セッション情報を返す', async () => {
    const { result } = renderHook(() => useAuthSession(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({
      userId: 'mock-user-id',
      roomId: 'mock-room-id',
      idToken: 'mock-id-token',
      hasToken: true,
    })

    expect(useUserStore.getState().userId).toBe('mock-user-id')
  })

  it('トークンがない場合、hasToken: false を返す', async () => {
    server.use(
      http.get('/api/token', () => {
        return HttpResponse.json({ hasToken: false })
      }),
    )

    const { result } = renderHook(() => useAuthSession(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({ hasToken: false })
    expect(useUserStore.getState().userId).toBeUndefined()
  })
})

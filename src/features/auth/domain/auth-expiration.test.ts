import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthExpiration } from './auth-expiration'

describe('AuthExpiration', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create expiration with valid timestamp', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const pastTimestamp = Date.now() - 1000
    const expiration = new AuthExpiration(pastTimestamp)

    expect(expiration.getValue()).toBe(pastTimestamp)
  })

  it('should throw error when timestamp is in the future', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const futureTimestamp = Date.now() + 1000

    expect(() => new AuthExpiration(futureTimestamp)).toThrow(
      'Expiration is required'
    )
  })
})

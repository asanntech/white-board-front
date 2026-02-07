import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthEntity } from './index'

describe('AuthEntity', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create entity with valid params', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const params = {
      accessToken: 'access-token',
      idToken: 'id-token',
      refreshToken: 'refresh-token',
      expiresIn: Date.now() - 1000,
    }

    const entity = new AuthEntity(params)

    expect(entity.accessToken).toBe('access-token')
    expect(entity.idToken).toBe('id-token')
    expect(entity.refreshToken).toBe('refresh-token')
    expect(entity.expiresIn).toBe(params.expiresIn)
  })

  it('should throw error when accessToken is empty', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const params = {
      accessToken: '',
      idToken: 'id-token',
      refreshToken: 'refresh-token',
      expiresIn: Date.now() - 1000,
    }

    expect(() => new AuthEntity(params)).toThrow('Access token is required')
  })

  it('should throw error when idToken is empty', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const params = {
      accessToken: 'access-token',
      idToken: '',
      refreshToken: 'refresh-token',
      expiresIn: Date.now() - 1000,
    }

    expect(() => new AuthEntity(params)).toThrow('ID token is required')
  })

  it('should throw error when refreshToken is empty', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const params = {
      accessToken: 'access-token',
      idToken: 'id-token',
      refreshToken: '',
      expiresIn: Date.now() - 1000,
    }

    expect(() => new AuthEntity(params)).toThrow('Refresh token is required')
  })

  it('should throw error when expiresIn is in the future', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    const params = {
      accessToken: 'access-token',
      idToken: 'id-token',
      refreshToken: 'refresh-token',
      expiresIn: Date.now() + 1000,
    }

    expect(() => new AuthEntity(params)).toThrow('Expiration is required')
  })
})

import { AuthService } from './auth.service'
import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'

jest.mock('jsonwebtoken')
jest.mock('jwks-rsa')

describe('AuthService', () => {
  let service: AuthService
  const mockGetSigningKey = jest.fn()

  const decode = jwt.decode as jest.Mock
  const verify = jwt.verify as jest.Mock
  const jwksClientMock = jwksClient as unknown as jest.Mock

  beforeEach(() => {
    process.env.COGNITO_ISSUER = 'https://example.com'

    // モック戻り値の共通化
    jwksClientMock.mockReturnValue({
      getSigningKey: mockGetSigningKey,
    })

    service = new AuthService()

    jest.clearAllMocks()
  })

  describe('extractToken', () => {
    it('should extract token from Authorization header', () => {
      const mockRequest: any = {
        headers: { authorization: 'Bearer abc.def.ghi' },
      }

      const token = service.extractToken(mockRequest)
      expect(token).toBe('abc.def.ghi')
    })

    it('should return null if Authorization header is missing or invalid', () => {
      expect(service.extractToken({ headers: {} } as any)).toBeNull()
      expect(service.extractToken({ headers: { authorization: 'Basic xxxxx' } } as any)).toBeNull()
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const mockToken = 'abc.def.ghi'
      const mockDecoded = { header: { kid: 'mock-kid' } }
      const mockPayload = { sub: 'user123', email: 'user@example.com' }

      decode.mockReturnValue(mockDecoded)
      mockGetSigningKey.mockResolvedValue({
        getPublicKey: () => 'mock-public-key',
      })
      verify.mockReturnValue(mockPayload)

      const payload = await service.verifyToken(mockToken)

      expect(decode).toHaveBeenCalledWith(mockToken, { complete: true })
      expect(mockGetSigningKey).toHaveBeenCalledWith('mock-kid')
      expect(verify).toHaveBeenCalledWith(mockToken, 'mock-public-key', {
        algorithms: ['RS256'],
        issuer: process.env.COGNITO_ISSUER,
      })
      expect(payload).toEqual(mockPayload)
    })

    it('should throw error if token is invalid format', async () => {
      decode.mockReturnValue(null)
      await expect(service.verifyToken('invalid.token')).rejects.toThrow('Invalid token format')
    })
  })
})

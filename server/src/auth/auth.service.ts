import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'
import { Request } from 'express'

@Injectable()
export class AuthService {
  private client = jwksClient({
    jwksUri: `${process.env.COGNITO_ISSUER}/.well-known/jwks.json`,
  })

  extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) return null
    return authHeader.replace('Bearer ', '')
  }

  async verifyToken(token: string): Promise<jwt.JwtPayload | string> {
    const decoded = jwt.decode(token, { complete: true })

    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
      throw new Error('Invalid token format')
    }

    const key = await this.client.getSigningKey(decoded.header.kid)
    return jwt.verify(token, key.getPublicKey(), {
      algorithms: ['RS256'],
      issuer: process.env.COGNITO_ISSUER,
    })
  }
}

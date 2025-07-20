import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.authService.extractToken(request)

    if (!token) throw new UnauthorizedException('Token not found')

    try {
      const payload = await this.authService.verifyToken(token)
      console.log(payload)
      return true
    } catch (err) {
      console.error(err)
      throw new UnauthorizedException('Token verification failed')
    }
  }
}

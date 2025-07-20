import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export const config = {
  matcher: '/((?!_next/static|_next/image|images|favicon.ico).*)',
}

export async function middleware(request: NextRequest) {
  const cookie = await cookies()

  const url = request.nextUrl

  if (url.pathname === '/auth/callback') {
    return NextResponse.next()
  }

  const hasToken = cookie.has('access-token') && cookie.has('id-token')

  // TODO: ルームIDを動的に取得する
  if (url.pathname === '/' && hasToken) {
    return NextResponse.redirect(new URL('/room/1', request.url))
  }

  if (url.pathname !== '/' && !hasToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

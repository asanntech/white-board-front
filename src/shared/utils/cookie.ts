export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
}

export const TOKEN_COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  ID_TOKEN: 'id_token',
  REFRESH_TOKEN: 'refresh_token',
  EXPIRED: 'expired',
}

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cef-motors-super-secret-key-change-in-production'

export interface JwtPayload {
  id: number
  username: string
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function getTokenFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='))
  return token ? token.split('=')[1] : null
}

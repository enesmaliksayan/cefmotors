import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cef-motors-super-secret-key-change-in-production'

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='))

  if (!token) {
    return Response.json({ valid: false }, { status: 401 })
  }

  const tokenValue = token.split('=')[1]
  try {
    const decoded = jwt.verify(tokenValue, JWT_SECRET)
    return Response.json({ valid: true, user: decoded })
  } catch {
    return Response.json({ valid: false }, { status: 401 })
  }
}

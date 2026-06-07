import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@cef/database'

const JWT_SECRET = process.env.JWT_SECRET || 'cef-motors-super-secret-key-change-in-production'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const admin = await prisma.adminUser.findUnique({ where: { username } })
    if (!admin) {
      return Response.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      return Response.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 })
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' })

    const response = Response.json({ success: true })
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`
    )

    return response
  } catch {
    return Response.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function GET() {
  const response = Response.json({ success: true })
  response.headers.set(
    'Set-Cookie',
    'token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0'
  )
  return response
}

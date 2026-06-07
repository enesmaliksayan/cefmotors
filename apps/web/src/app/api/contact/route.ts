import { prisma } from '@cef/database'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = await prisma.contactMessage.create({ data: body })
    return Response.json({ success: true, message })
  } catch {
    return Response.json({ error: 'Mesaj gönderilemedi' }, { status: 500 })
  }
}

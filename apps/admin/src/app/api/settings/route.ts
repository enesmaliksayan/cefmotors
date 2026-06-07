import { prisma } from '@cef/database'

export async function GET() {
  const gallery = await prisma.gallery.findFirst()
  return Response.json(gallery)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const gallery = await prisma.gallery.update({ where: { id: 1 }, data: body })
  return Response.json(gallery)
}

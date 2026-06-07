import { prisma } from '@cef/database'

export async function GET() {
  const gallery = await prisma.gallery.findFirst()
  return Response.json(gallery)
}

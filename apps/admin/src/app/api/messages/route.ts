import { prisma } from '@cef/database'

export async function GET() {
  const messages = await prisma.contactMessage.findMany({
    include: { car: { select: { brand: true, model: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(messages)
}

export async function POST(request: Request) {
  const body = await request.json()
  const message = await prisma.contactMessage.create({ data: body })
  return Response.json(message)
}

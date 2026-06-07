import { prisma } from '@cef/database'
import { NextRequest } from 'next/server'

export async function GET() {
  const cars = await prisma.car.findMany({
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(cars)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const car = await prisma.car.create({
    data: { ...body, publishedAt: body.isPublished ? new Date() : null },
  })
  return Response.json(car)
}

import { prisma } from '@cef/database'
import { NextRequest } from 'next/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const car = await prisma.car.findUnique({
    where: { id: Number(id), isPublished: true },
    include: { images: { orderBy: { order: 'asc' } }, videos: true },
  })
  if (!car) {
    return Response.json({ error: 'Araç bulunamadı' }, { status: 404 })
  }
  return Response.json(car)
}

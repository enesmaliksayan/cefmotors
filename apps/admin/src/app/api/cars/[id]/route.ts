import { prisma } from '@cef/database'
import { NextRequest } from 'next/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const car = await prisma.car.findUnique({
    where: { id: Number(id) },
    include: { images: { orderBy: { order: 'asc' } }, videos: true },
  })
  if (!car) return Response.json({ error: 'Araç bulunamadı' }, { status: 404 })
  return Response.json(car)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const existing = await prisma.car.findUnique({ where: { id: Number(id) } })
  const data: Record<string, unknown> = { ...body }
  if (body.isPublished === true && !existing?.publishedAt) {
    data.publishedAt = new Date()
  } else if (body.isPublished === false) {
    data.publishedAt = null
  }
  const car = await prisma.car.update({ where: { id: Number(id) }, data })
  return Response.json(car)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.car.delete({ where: { id: Number(id) } })
  return Response.json({ success: true })
}

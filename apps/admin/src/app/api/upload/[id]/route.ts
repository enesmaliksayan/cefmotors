import { prisma } from '@cef/database'
import { unlink } from 'fs/promises'
import path from 'path'
import { NextRequest } from 'next/server'

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const image = await prisma.carImage.findUnique({ where: { id: Number(id) } })
  if (!image) return Response.json({ error: 'Görsel bulunamadı' }, { status: 404 })

  const filepath = path.join(process.cwd(), 'public', image.url)
  try { await unlink(filepath) } catch {}

  await prisma.carImage.delete({ where: { id: Number(id) } })
  return Response.json({ success: true })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  if (body.isPrimary) {
    const image = await prisma.carImage.findUnique({ where: { id: Number(id) } })
    if (image) {
      await prisma.carImage.updateMany({
        where: { carId: image.carId },
        data: { isPrimary: false },
      })
    }
  }

  const updated = await prisma.carImage.update({
    where: { id: Number(id) },
    data: body,
  })

  return Response.json(updated)
}

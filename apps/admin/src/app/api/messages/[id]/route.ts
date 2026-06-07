import { prisma } from '@cef/database'
import { NextRequest } from 'next/server'

export async function PATCH(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const message = await prisma.contactMessage.update({
    where: { id: Number(id) },
    data: { isRead: true },
  })
  return Response.json(message)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.contactMessage.delete({ where: { id: Number(id) } })
  return Response.json({ success: true })
}

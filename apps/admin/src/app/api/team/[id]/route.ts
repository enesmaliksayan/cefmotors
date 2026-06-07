import { prisma } from '@cef/database'
import { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const member = await prisma.teamMember.update({ where: { id: Number(id) }, data: body })
  return Response.json(member)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.teamMember.delete({ where: { id: Number(id) } })
  return Response.json({ success: true })
}

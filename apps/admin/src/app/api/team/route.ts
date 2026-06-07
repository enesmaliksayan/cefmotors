import { prisma } from '@cef/database'

export async function GET() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  return Response.json(members)
}

export async function POST(request: Request) {
  const body = await request.json()
  const member = await prisma.teamMember.create({ data: body })
  return Response.json(member)
}

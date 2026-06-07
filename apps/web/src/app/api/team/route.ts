import { prisma } from '@cef/database'

export async function GET() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  return Response.json(members)
}

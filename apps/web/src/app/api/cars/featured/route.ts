import { prisma } from '@cef/database'

export async function GET() {
  const cars = await prisma.car.findMany({
    where: { isPublished: true, isFeatured: true },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(cars)
}

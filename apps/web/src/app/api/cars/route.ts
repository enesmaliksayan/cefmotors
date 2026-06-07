import { prisma } from '@cef/database'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const fuelType = searchParams.get('fuelType')
  const transmission = searchParams.get('transmission')
  const sort = searchParams.get('sort') || 'newest'

  const where: Record<string, unknown> = { isPublished: true }

  if (brand) where.brand = { contains: brand }
  if (fuelType) where.fuelType = fuelType
  if (transmission) where.transmission = transmission
  if (minPrice || maxPrice) {
    (where as any).price = {}
    if (minPrice) (where as any).price.gte = Number(minPrice)
    if (maxPrice) (where as any).price.lte = Number(maxPrice)
  }

  const orderBy =
    sort === 'price_asc' ? { price: 'asc' as const } :
    sort === 'price_desc' ? { price: 'desc' as const } :
    sort === 'oldest' ? { year: 'asc' as const } :
    { createdAt: 'desc' as const }

  const cars = await prisma.car.findMany({
    where: where as any,
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy,
  })

  return Response.json(cars)
}

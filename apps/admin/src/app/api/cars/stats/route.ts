import { prisma } from '@cef/database'
import { NextRequest } from 'next/server'

export async function GET() {
  const totalCars = await prisma.car.count()
  const publishedCars = await prisma.car.count({ where: { isPublished: true } })
  const soldCars = await prisma.car.count({ where: { status: 'sold' } })
  const unreadMessages = await prisma.contactMessage.count({ where: { isRead: false } })
  const totalMessages = await prisma.contactMessage.count()
  const featuredCars = await prisma.car.count({ where: { isFeatured: true } })

  return Response.json({ totalCars, publishedCars, soldCars, unreadMessages, totalMessages, featuredCars })
}

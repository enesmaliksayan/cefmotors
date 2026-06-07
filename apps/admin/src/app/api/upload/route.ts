import { prisma } from '@cef/database'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const carId = formData.get('carId') as string

    if (!file || !carId) {
      return Response.json({ error: 'Dosya ve araç ID gerekli' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${carId}-${Date.now()}.${ext}`

    const blob = await put(filename, file, { access: 'public' })

    const imageCount = await prisma.carImage.count({ where: { carId: Number(carId) } })

    const image = await prisma.carImage.create({
      data: {
        carId: Number(carId),
        url: blob.url,
        isPrimary: imageCount === 0,
        order: imageCount,
      },
    })

    return Response.json(image)
  } catch (error) {
    return Response.json({ error: 'Yükleme başarısız' }, { status: 500 })
  }
}

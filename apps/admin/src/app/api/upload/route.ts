import { prisma } from '@cef/database'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const carId = formData.get('carId') as string

    if (!file || !carId) {
      return Response.json({ error: 'Dosya ve araç ID gerekli' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const ext = file.name.split('.').pop()
    const filename = `${carId}-${Date.now()}.${ext}`
    const filepath = path.join(uploadsDir, filename)

    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    const imageCount = await prisma.carImage.count({ where: { carId: Number(carId) } })

    const image = await prisma.carImage.create({
      data: {
        carId: Number(carId),
        url: `/uploads/${filename}`,
        isPrimary: imageCount === 0,
        order: imageCount,
      },
    })

    return Response.json(image)
  } catch (error) {
    return Response.json({ error: 'Yükleme başarısız' }, { status: 500 })
  }
}

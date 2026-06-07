import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'cefadmin2026', 10)

  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { passwordHash: hash },
    create: { username: 'admin', passwordHash: hash },
  })

  await prisma.gallery.upsert({
    where: { id: 1 },
    update: {
      name: 'CEF MOTORS',
      address: 'Cumhuriyet Mahallesi, 52. Sk. No:4, 34906 Büyükçekmece/İstanbul',
      phone: '+90 555 123 45 67',
      email: 'info@cefmotors.com',
      workingHours: 'Hafta içi: 09:00 - 19:00 | Cumartesi: 10:00 - 17:00',
      about: 'CEF MOTORS olarak premium araçlar konusunda uzmanlaşmış bir oto galeriyiz. 10 yılı aşkın tecrübemizle size en kaliteli araçları sunuyoruz.',
      latitude: 41.0754783,
      longitude: 28.9722343,
      mapsUrl: 'https://www.google.com/maps/place/cef+motors/@41.0753998,28.9720759,71m/data=!3m1!1e3!4m6!3m5!1s0x14cab7a924e7381b:0x7ec5ad6a5379b521!8m2!3d41.0754783!4d28.9722343!16s%2Fg%2F11m78qhqzg?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D',
    },
    create: {
      name: 'CEF MOTORS',
      address: 'Cumhuriyet Mahallesi, 52. Sk. No:4, 34906 Büyükçekmece/İstanbul',
      phone: '+90 555 123 45 67',
      email: 'info@cefmotors.com',
      workingHours: 'Hafta içi: 09:00 - 19:00 | Cumartesi: 10:00 - 17:00',
      about: 'CEF MOTORS olarak premium araçlar konusunda uzmanlaşmış bir oto galeriyiz. 10 yılı aşkın tecrübemizle size en kaliteli araçları sunuyoruz.',
      latitude: 41.0754783,
      longitude: 28.9722343,
      mapsUrl: 'https://www.google.com/maps/place/cef+motors/@41.0753998,28.9720759,71m/data=!3m1!1e3!4m6!3m5!1s0x14cab7a924e7381b:0x7ec5ad6a5379b521!8m2!3d41.0754783!4d28.9722343!16s%2Fg%2F11m78qhqzg?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D',
    },
  })

  await prisma.teamMember.deleteMany()
  await prisma.teamMember.createMany({
    data: [
      { name: 'Ahmet Yılmaz', title: 'Genel Müdür', phone: '+90 555 111 22 33', email: 'ahmet@cefmotors.com', order: 1 },
      { name: 'Mehmet Demir', title: 'Satış Danışmanı', phone: '+90 555 222 33 44', email: 'mehmet@cefmotors.com', order: 2 },
      { name: 'Ayşe Kaya', title: 'Pazarlama Uzmanı', phone: '+90 555 333 44 55', email: 'ayse@cefmotors.com', order: 3 },
    ],
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

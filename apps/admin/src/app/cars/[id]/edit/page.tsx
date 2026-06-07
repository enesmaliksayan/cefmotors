'use client'

import { use } from 'react'
import CarForm from '@/components/CarForm'

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <CarForm carId={id} />
}

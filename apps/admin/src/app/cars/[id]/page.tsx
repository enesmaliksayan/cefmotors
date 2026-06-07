'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, ImageIcon } from 'lucide-react'

interface Car {
  id: number
  brand: string
  model: string
  year: number
  price: number
  currency: string
  mileage: number | null
  fuelType: string | null
  transmission: string | null
  color: string | null
  enginePower: string | null
  description: string
  status: string
  isPublished: boolean
  isFeatured: boolean
  publishedAt: string | null
  images: { id: number; url: string; isPrimary: boolean }[]
  videos: { id: number; url: string; title: string | null }[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  available: { label: 'Satışta', color: '#22C55E' },
  reserved: { label: 'Rezerve', color: '#F59E0B' },
  sold: { label: 'Satıldı', color: '#E63946' },
}

const specs = [
  { key: 'mileage', label: 'Kilometre', suffix: ' km' },
  { key: 'fuelType', label: 'Yakıt Tipi' },
  { key: 'transmission', label: 'Vites' },
  { key: 'color', label: 'Renk' },
  { key: 'enginePower', label: 'Motor Gücü' },
]

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [car, setCar] = useState<Car | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/cars/${id}`).then(res => res.json()).then(setCar)
  }, [id])

  if (!car) return null

  const statusInfo = statusLabels[car.status] || statusLabels.available

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{car.brand} {car.model}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{car.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/cars/${car.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Pencil className="w-4 h-4" /> Düzenle
          </button>
          <button
            onClick={() => router.push(`/cars/${car.id}/images`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            <ImageIcon className="w-4 h-4" /> Medya
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            <img
              src={car.images.find(i => i.isPrimary)?.url || car.images[0]?.url || '/placeholder-car.svg'}
              alt={`${car.brand} ${car.model}`}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>

          <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Açıklama</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{car.description}</p>
          </div>

          {car.videos.length > 0 && (
            <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Videolar</h2>
              <div className="space-y-2">
                {car.videos.map((v, i) => (
                  <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                    className="block p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg)', color: 'var(--accent)' }}>
                    {v.title || `Video ${i + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--gold)' }}>
              {car.price.toLocaleString('tr-TR')} {car.currency}
            </div>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}>
              {statusInfo.label}
            </span>
            <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              {car.isPublished ? 'Yayında' : 'Yayında değil'}
              {car.isFeatured ? ' · Öne Çıkan' : ''}
            </div>
            {car.publishedAt && (
              <div className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                Yayın: {new Date(car.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}{Math.floor((Date.now() - new Date(car.publishedAt).getTime()) / 86400000)} gündür ilanda
              </div>
            )}
          </div>

          <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Teknik Özellikler</h3>
            <div className="space-y-3">
              {specs.map(s => {
                const val = car[s.key as keyof Car]
                if (!val && val !== 0) return null
                return (
                  <div key={s.key} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                    <span style={{ color: 'var(--text)' }}>
                      {typeof val === 'number' ? val.toLocaleString('tr-TR') : val}
                      {(s as any).suffix || ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Görseller ({car.images.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {car.images.map(img => (
                <div key={img.id} className="aspect-square rounded-md overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

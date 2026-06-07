'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Eye, EyeOff, MoreHorizontal, Search } from 'lucide-react'

interface Car {
  id: number
  brand: string
  model: string
  year: number
  price: number
  currency: string
  status: string
  isPublished: boolean
  isFeatured: boolean
  images: { url: string }[]
  createdAt: string
  publishedAt: string | null
}

const statusLabels: Record<string, { label: string; color: string }> = {
  available: { label: 'Satışta', color: '#22C55E' },
  reserved: { label: 'Rezerve', color: '#F59E0B' },
  sold: { label: 'Satıldı', color: '#E63946' },
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/cars').then(res => res.json()).then(setCars).finally(() => setLoading(false))
  }, [])

  const filtered = cars.filter(c =>
    `${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(search.toLowerCase())
  )

  async function togglePublish(id: number, current: boolean) {
    await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    })
    setCars(cars.map(c => c.id === id ? { ...c, isPublished: !current } : c))
  }

  async function deleteCar(id: number) {
    if (!confirm('Bu aracı silmek istediğinize emin misiniz?')) return
    await fetch(`/api/cars/${id}`, { method: 'DELETE' })
    setCars(cars.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Araçlar</h1>
        <button
          onClick={() => router.push('/cars/new')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          Yeni Araç
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Araç ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--surface)' }}>
                {['Görsel', 'Araç', 'Yıl', 'Fiyat', 'Durum', 'Yayın Tarihi', 'Yayın', 'İşlemler'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(car => {
                const statusInfo = statusLabels[car.status] || statusLabels.available
                return (
                  <tr key={car.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-3">
                      <div
                        className="w-12 h-10 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${car.images[0]?.url || '/placeholder-car.svg'})`, backgroundColor: 'var(--surface-2)' }}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>
                      {car.brand} {car.model}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{car.year}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--gold)' }}>
                      {car.price.toLocaleString('tr-TR')} {car.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {car.publishedAt
                        ? <>{new Date(car.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}<br /><span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>{Math.floor((Date.now() - new Date(car.publishedAt).getTime()) / 86400000)} gündür</span></>
                        : car.isPublished ? 'Bilinmiyor' : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublish(car.id, car.isPublished)}
                        className="p-1 rounded transition-colors hover:opacity-70"
                        style={{ color: car.isPublished ? '#22C55E' : 'var(--text-muted)' }}
                      >
                        {car.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/cars/${car.id}`)}
                          className="p-1.5 rounded transition-colors hover:opacity-70"
                          style={{ color: 'var(--text-muted)' }}
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/cars/${car.id}/images`)}
                          className="p-1.5 rounded transition-colors hover:opacity-70"
                          style={{ color: 'var(--text-muted)' }}
                          title="Görseller"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCar(car.id)}
                          className="p-1.5 rounded transition-colors hover:opacity-70"
                          style={{ color: 'var(--accent)' }}
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                    Henüz araç bulunmuyor
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

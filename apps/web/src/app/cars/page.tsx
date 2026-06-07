'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, X } from 'lucide-react'

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
  publishedAt: string | null
  images: { url: string }[]
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ fuelType: '', transmission: '', sort: 'newest', minPrice: '', maxPrice: '' })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('brand', search)
    if (filters.fuelType) params.set('fuelType', filters.fuelType)
    if (filters.transmission) params.set('transmission', filters.transmission)
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)

    fetch(`/api/cars?${params}`)
      .then(r => r.json())
      .then(setCars)
      .finally(() => setLoading(false))
  }, [search, filters])

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
            ARAÇLARIMIZ
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            {cars.length} araç bulundu
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Marka ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
            style={{ borderColor: 'var(--border)', color: showFilters ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtrele
          </button>
          <select
            value={filters.sort}
            onChange={e => setFilters({ ...filters, sort: e.target.value })}
            className="px-3 py-2.5 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
          </select>
        </div>

        {showFilters && (
          <div className="rounded-xl p-5 border mb-6 flex flex-wrap gap-4 items-end" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Yakıt Tipi</label>
              <select
                value={filters.fuelType}
                onChange={e => setFilters({ ...filters, fuelType: e.target.value })}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <option value="">Tümü</option>
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Hibrit">Hibrit</option>
                <option value="Elektrik">Elektrik</option>
                <option value="LPG">LPG</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Vites</label>
              <select
                value={filters.transmission}
                onChange={e => setFilters({ ...filters, transmission: e.target.value })}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <option value="">Tümü</option>
                <option value="Otomatik">Otomatik</option>
                <option value="Manuel">Manuel</option>
                <option value="Yarı Otomatik">Yarı Otomatik</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Min Fiyat</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-28 px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Max Fiyat</label>
              <input
                type="number"
                placeholder="999999"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-28 px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <button
              onClick={() => setFilters({ fuelType: '', transmission: '', sort: 'newest', minPrice: '', maxPrice: '' })}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ color: 'var(--accent)' }}
            >
              <X className="w-3 h-3" /> Temizle
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Aramanızla eşleşen araç bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group rounded-xl overflow-hidden border transition-all duration-300 hover:translate-y-[-4px]"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={car.images[0]?.url || '/placeholder-car.svg'}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
                      {car.brand} {car.model}
                    </h3>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{car.year}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    {car.mileage != null && <span>{car.mileage.toLocaleString('tr-TR')} km</span>}
                    {car.fuelType && <span>{car.fuelType}</span>}
                    {car.transmission && <span>{car.transmission}</span>}
                  </div>
                  <div className="text-xl font-bold" style={{ color: 'var(--gold)' }}>
                    {car.price.toLocaleString('tr-TR')} {car.currency}
                  </div>
                  {car.publishedAt && (
                    <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(car.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })} · {Math.floor((Date.now() - new Date(car.publishedAt).getTime()) / 86400000)} gündür ilanda
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

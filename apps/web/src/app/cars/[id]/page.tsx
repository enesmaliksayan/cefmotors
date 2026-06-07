'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Phone, Mail, Send, CheckCircle2, X } from 'lucide-react'

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
  publishedAt: string | null
  images: { id: number; url: string; isPrimary: boolean }[]
  videos: { id: number; url: string; title: string | null }[]
}

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then(r => r.json())
      .then(data => { setCar(data); if (data.error) setCar(null) })
      .catch(() => setCar(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        carId: car?.id,
        carBrand: car?.brand,
        carModel: car?.model,
      }),
    })
    setSending(false)
    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="pt-24 min-h-dvh flex items-center justify-center">
        <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="pt-24 min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--text-muted)' }}>Araç bulunamadı.</p>
          <Link href="/cars" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Geri dön</Link>
        </div>
      </div>
    )
  }

  const specs = [
    { key: 'mileage', label: 'Kilometre', value: car.mileage ? `${car.mileage.toLocaleString('tr-TR')} km` : null },
    { key: 'fuelType', label: 'Yakıt Tipi', value: car.fuelType },
    { key: 'transmission', label: 'Vites', value: car.transmission },
    { key: 'color', label: 'Renk', value: car.color },
    { key: 'enginePower', label: 'Motor Gücü', value: car.enginePower },
  ].filter(s => s.value)

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match?.[1] || null
  }

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Tüm Araçlar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div
              className="aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border group relative"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={car.images[selectedImg]?.url || '/placeholder-car.svg'}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {car.images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedImg(i => (i - 1 + car.images.length) % car.images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedImg(i => (i + 1) % car.images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {car.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {car.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImg ? '' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderColor: i === selectedImg ? 'var(--accent)' : 'var(--border)' }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
                  {car.brand} {car.model}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{car.year}</p>
              </div>
              {car.status === 'sold' && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: 'var(--accent)' }}>
                  SATILDI
                </span>
              )}
            </div>

            <div className="text-3xl font-bold mb-6" style={{ color: 'var(--gold)' }}>
              {car.price.toLocaleString('tr-TR')} {car.currency}
            </div>
            {car.publishedAt && (
              <div className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                İlan yayınlanma: {new Date(car.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}{Math.floor((Date.now() - new Date(car.publishedAt).getTime()) / 86400000)} gündür ilanda
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {specs.map(s => (
                <div key={s.key} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
                  <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE || '+905551234567'}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Phone className="w-4 h-4" /> Hemen Ara
              </a>
              <Link
                href={`/contact?car=${car.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold transition-all border"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <Mail className="w-4 h-4" /> Mesaj Gönder
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="rounded-xl p-6 lg:p-8 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Araç Hakkında</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
              {car.description || 'Bu araç hakkında detaylı bilgi için lütfen iletişime geçin.'}
            </p>
          </div>

          <div className="rounded-xl p-6 lg:p-8 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Bu Araç Hakkında Bilgi Al</h2>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#22C55E' }} />
                <p className="font-semibold" style={{ color: 'var(--text)' }}>Mesajınız Gönderildi!</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>En kısa sürede size dönüş yapacağız.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefon (opsiyonel)"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                <textarea
                  placeholder="Mesajınız..."
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm resize-none"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Gönder</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {car.videos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>Videolar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {car.videos.map((v, i) => {
                const vid = getYoutubeId(v.url)
                return (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                    {vid ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${vid}`}
                        title={v.title || `Video ${i + 1}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <a href={v.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-full text-sm" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent)' }}>
                        {v.title || `Video ${i + 1}`}
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={car.images[selectedImg]?.url || '/placeholder-car.svg'}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()}
          />
          {car.images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setSelectedImg(i => (i - 1 + car.images.length) % car.images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setSelectedImg(i => (i + 1) % car.images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

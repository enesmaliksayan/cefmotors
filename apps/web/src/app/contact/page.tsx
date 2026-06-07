'use client'

import { useEffect, useState, use } from 'react'
import dynamic from 'next/dynamic'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
    <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
  </div>
)})

interface Gallery {
  name: string
  address: string
  phone: string
  email: string
  workingHours: string
  mapsUrl: string | null
  latitude: number | null
  longitude: number | null
}

export default function ContactPage({ searchParams }: { searchParams: Promise<{ car?: string }> }) {
  const resolvedParams = use(searchParams)
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setGallery).catch(() => {})
    if (resolvedParams?.car) {
      fetch(`/api/cars/${resolvedParams.car}`)
        .then(r => r.json())
        .then(car => {
          if (car?.brand) {
            setForm(prev => ({ ...prev, message: `${car.brand} ${car.model} hakkında bilgi almak istiyorum.` }))
          }
        })
        .catch(() => {})
    }
  }, [resolvedParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSending(false)
    setSubmitted(true)
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--accent)' }}>İletişim</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-3" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
            BİZE ULAŞIN
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="rounded-xl p-6 lg:p-8 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>İletişim Formu</h2>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#22C55E' }} />
                <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Mesajınız Gönderildi!</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>En kısa sürede size dönüş yapacağız.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                </div>
                <textarea
                  placeholder="Mesajınız..."
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm resize-none"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Mesaj Gönder</>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="h-[300px] rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              <Map />
            </div>

            <div className="rounded-xl p-5 border space-y-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              {gallery?.mapsUrl && (
                <a
                  href={gallery.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#4285F4' }}
                >
                  <MapPin className="w-4 h-4" /> Google Maps'te Aç
                </a>
              )}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Adres</p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{gallery?.address || 'İstanbul, Türkiye'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Telefon</p>
                    <a href={`tel:${gallery?.phone}`} className="text-sm mt-0.5 block transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                      {gallery?.phone || '+90 555 123 45 67'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Email</p>
                    <a href={`mailto:${gallery?.email}`} className="text-sm mt-0.5 block transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                      {gallery?.email || 'info@cefmotors.com'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Çalışma Saatleri</p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{gallery?.workingHours || 'Hafta içi: 09:00 - 19:00'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

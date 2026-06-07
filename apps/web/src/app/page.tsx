'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Search, Fuel, Gauge, Calendar, Shield } from 'lucide-react'

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
  images: { url: string }[]
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null!)
  const inView = useInView(ref)
  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </section>
  )
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Car[]>([])
  const [stats, setStats] = useState({ total: 0, sold: 0, years: 0 })

  useEffect(() => {
    fetch('/api/cars/featured').then(r => r.json()).then(setFeatured).catch(() => {})
  }, [])

  return (
    <>
      <section className="relative min-h-dvh flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(230,57,70,0.15) 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 w-full pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
              Premium Araçlar
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
              HAYALİNİZDEKİ
              <br />
              <span style={{ color: 'var(--accent)' }}>ARACI</span> BULUN
            </h1>
            <p className="text-lg mb-8 max-w-xl" style={{ color: 'var(--text-muted)' }}>
              CEF MOTORS olarak premium araçlar konusunda uzmanlaştık. Size en kaliteli araçları sunuyor, satış sonrası desteğimizle yanınızda oluyoruz.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Araçları İncele
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold transition-all border"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                İletişime Geç
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { icon: Shield, label: 'Güvenilir', desc: 'Tüm araçlar garantili' },
              { icon: Fuel, label: 'Geniş Seçenek', desc: 'Her bütçeye uygun' },
              { icon: Gauge, label: 'Hızlı Süreç', desc: 'Aynı gün teslimat' },
              { icon: Calendar, label: 'Uzman Ekip', desc: '10+ yıl tecrübe' },
            ].map(item => (
              <div key={item.label} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
                <item.icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
        </div>
      </section>

      {featured.length > 0 && (
        <AnimatedSection className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Öne Çıkanlar</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-2" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
                GÜNCEL ARAÇLAR
              </h2>
            </div>
            <Link href="/cars" className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-70" style={{ color: 'var(--accent)' }}>
              Tümünü Gör <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(car => (
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
                    {car.mileage && <span>{car.mileage.toLocaleString('tr-TR')} km</span>}
                    {car.fuelType && <span>{car.fuelType}</span>}
                    {car.transmission && <span>{car.transmission}</span>}
                  </div>
                  <div className="text-xl font-bold" style={{ color: 'var(--gold)' }}>
                    {car.price.toLocaleString('tr-TR')} {car.currency}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection className="relative py-24 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(230,57,70,0.08) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
            BİZE ULAŞIN
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Hayalinizdeki araç hakkında bilgi almak için bizimle iletişime geçin
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            İletişim Formu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AnimatedSection>
    </>
  )
}

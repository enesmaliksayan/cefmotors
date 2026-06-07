'use client'

import { useEffect, useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

interface TeamMember {
  id: number
  name: string
  title: string
  photo: string | null
  phone: string | null
  email: string | null
}

interface Gallery {
  name: string
  about: string
  address: string
  phone: string
  email: string
  workingHours: string
}

export default function AboutPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [gallery, setGallery] = useState<Gallery | null>(null)

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(setMembers).catch(() => {})
    fetch('/api/settings').then(r => r.json()).then(setGallery).catch(() => {})
  }, [])

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Hakkımızda</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-3 mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
            CEF MOTORS
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {gallery?.about || 'Premium araçlar konusunda uzmanlaşmış oto galeri.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            <div className="aspect-[4/3]" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl font-bold" style={{ color: 'var(--accent)' }}>CEF</span>
                  <span className="text-3xl font-semibold ml-2" style={{ color: 'var(--text)' }}>MOTORS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl p-6 border flex items-start gap-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Adres</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{gallery?.address || 'İstanbul, Türkiye'}</p>
              </div>
            </div>
            <div className="rounded-xl p-6 border flex items-start gap-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Telefon</h3>
                <a href={`tel:${gallery?.phone}`} className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  {gallery?.phone || '+90 555 123 45 67'}
                </a>
              </div>
            </div>
            <div className="rounded-xl p-6 border flex items-start gap-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Email</h3>
                <a href={`mailto:${gallery?.email}`} className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  {gallery?.email || 'info@cefmotors.com'}
                </a>
              </div>
            </div>
            <div className="rounded-xl p-6 border flex items-start gap-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Çalışma Saatleri</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{gallery?.workingHours || 'Hafta içi: 09:00 - 19:00'}</p>
              </div>
            </div>
          </div>
        </div>

        {members.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)' }}>
              EKİBİMİZ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map(member => (
                <div key={member.id} className="rounded-xl p-6 border text-center transition-all hover:translate-y-[-2px]" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>{member.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{member.title}</p>
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="block text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                      {member.phone}
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="block text-sm transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                      {member.email}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

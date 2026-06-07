'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [address, setAddress] = useState('İstanbul, Türkiye')
  const [phone, setPhone] = useState('+90 555 123 45 67')
  const [email, setEmail] = useState('info@cefmotors.com')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d?.address) setAddress(d.address)
        if (d?.phone) setPhone(d.phone)
        if (d?.email) setEmail(d.email)
      })
      .catch(() => {})
  }, [])

  return (
    <footer style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>CEF</span>
              <span className="text-lg font-semibold tracking-widest" style={{ color: 'var(--text)' }}>MOTORS</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Premium araçlar konusunda uzmanlaşmış oto galeri. Size en kaliteli araçları sunuyoruz.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Hızlı Linkler</h3>
            <div className="space-y-2">
              {[
                { href: '/', label: 'Ana Sayfa' },
                { href: '/cars', label: 'Araçlar' },
                { href: '/about', label: 'Hakkımızda' },
                { href: '/contact', label: 'İletişim' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm transition-colors hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>İletişim</h3>
            <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>{address}</p>
              <a href={`tel:${phone}`} className="block hover:opacity-70 transition-colors">{phone}</a>
              <a href={`mailto:${email}`} className="block hover:opacity-70 transition-colors">{email}</a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} CEF MOTORS. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
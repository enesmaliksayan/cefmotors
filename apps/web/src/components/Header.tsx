'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { Moon, Sun, Phone, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/cars', label: 'Araçlar' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/contact', label: 'İletişim' },
]

export default function Header() {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [phone, setPhone] = useState('+90 555 123 45 67')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { if (d?.phone) setPhone(d.phone) }).catch(() => {})
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}
      style={{
        backgroundColor: scrolled ? 'var(--bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-0">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight transition-colors" style={{ color: 'var(--accent)' }}>
              CEF
            </span>
            <span className="text-lg lg:text-xl font-semibold tracking-widest transition-colors" style={{ color: 'var(--text)' }}>
              MOTORS
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-6 text-sm font-medium transition-colors relative"
                style={{ color: pathname === link.href ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${phone}`}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>

            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-colors hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Tema değiştir"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text)' }}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: pathname === link.href ? 'var(--accent)' : 'var(--text-muted)',
                  backgroundColor: pathname === link.href ? 'var(--surface)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white mt-2"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

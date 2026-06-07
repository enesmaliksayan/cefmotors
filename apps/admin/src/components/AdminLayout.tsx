'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Car, MessageSquare, Settings, Users, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cars', label: 'Araçlar', icon: Car },
  { href: '/messages', label: 'Mesajlar', icon: MessageSquare },
  { href: '/team', label: 'Ekip', icon: Users },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/verify')
      .then(res => { if (!res.ok) throw new Error('Unauthorized'); setAuthed(true) })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!authed) return null

  return (
    <div className="min-h-dvh flex" style={{ backgroundColor: 'var(--bg)' }}>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>CEF</span>
            <span className="text-sm font-semibold tracking-widest" style={{ color: 'var(--text)' }}>ADMIN</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:opacity-70">
            <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={e => { e.preventDefault(); router.push(item.href); setSidebarOpen(false) }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-2)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </a>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => fetch('/api/auth/login', { method: 'GET' }).then(() => router.push('/login'))}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-dvh">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-md hover:opacity-70">
            <Menu className="w-5 h-5" style={{ color: 'var(--text)' }} />
          </button>
          <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {navItems.find(i => pathname.startsWith(i.href))?.label || 'Admin Panel'}
          </div>
          <div />
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

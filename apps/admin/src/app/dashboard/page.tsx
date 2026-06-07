'use client'

import { useEffect, useState } from 'react'
import { Car, MessageSquare, TrendingUp, CheckCircle2, Eye } from 'lucide-react'

interface Stats {
  totalCars: number
  publishedCars: number
  soldCars: number
  unreadMessages: number
  totalMessages: number
  featuredCars: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/cars/stats')
      .then(res => res.json())
      .then(setStats)
  }, [])

  const cards = [
    { label: 'Toplam Araç', value: stats?.totalCars ?? 0, icon: Car, color: '#E63946' },
    { label: 'Yayındaki Araçlar', value: stats?.publishedCars ?? 0, icon: Eye, color: '#22C55E' },
    { label: 'Satılan Araçlar', value: stats?.soldCars ?? 0, icon: CheckCircle2, color: '#F59E0B' },
    { label: 'Okunmamış Mesaj', value: stats?.unreadMessages ?? 0, icon: MessageSquare, color: '#C5A55A' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div
            key={card.label}
            className="rounded-xl p-5 border transition-all hover:translate-y-[-2px]"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>
              {card.value}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
          Son İşlemler
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Hoş geldiniz! Araç eklemek için "Araçlar" bölümünü kullanabilirsiniz.
        </p>
      </div>
    </div>
  )
}

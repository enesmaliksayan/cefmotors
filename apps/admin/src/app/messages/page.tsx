'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, Phone, MessageSquare } from 'lucide-react'

interface Message {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  isRead: boolean
  carId: number | null
  car: { brand: string; model: string } | null
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/messages').then(res => res.json()).then(setMessages).finally(() => setLoading(false))
  }, [])

  async function markRead(id: number) {
    await fetch(`/api/messages/${id}`, { method: 'PATCH' })
    setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m))
  }

  async function deleteMessage(id: number) {
    if (!confirm('Mesajı silmek istediğinize emin misiniz?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    setMessages(messages.filter(m => m.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Mesajlar</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className="rounded-xl p-5 border transition-all cursor-pointer"
              style={{
                backgroundColor: msg.isRead ? 'var(--surface)' : 'var(--surface-2)',
                borderColor: 'var(--border)',
                borderLeft: msg.isRead ? '3px solid var(--border)' : '3px solid var(--accent)',
              }}
              onClick={() => !msg.isRead && markRead(msg.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{msg.name}</h3>
                  {msg.car && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--gold)' }}>
                      {msg.car.brand} {msg.car.model} hakkında
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(msg.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button onClick={() => deleteMessage(msg.id)} className="p-1 rounded hover:opacity-70" style={{ color: 'var(--accent)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{msg.message}</p>

              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 hover:opacity-70">
                  <Mail className="w-3.5 h-3.5" /> {msg.email}
                </a>
                {msg.phone && (
                  <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 hover:opacity-70">
                    <Phone className="w-3.5 h-3.5" /> {msg.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Henüz mesaj yok</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

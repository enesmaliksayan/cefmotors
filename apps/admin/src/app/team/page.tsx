'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'

interface Member {
  id: number
  name: string
  title: string
  photo: string | null
  phone: string | null
  email: string | null
  order: number
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', title: '', phone: '', email: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team').then(res => res.json()).then(setMembers).finally(() => setLoading(false))
  }, [])

  async function addMember(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: members.length }),
    })
    const member = await res.json()
    setMembers([...members, member])
    setForm({ name: '', title: '', phone: '', email: '' })
    setShowForm(false)
  }

  async function deleteMember(id: number) {
    if (!confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return
    await fetch(`/api/team/${id}`, { method: 'DELETE' })
    setMembers(members.filter(m => m.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Ekip</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" /> Ekle
        </button>
      </div>

      {showForm && (
        <form onSubmit={addMember} className="rounded-xl p-5 border mb-6 space-y-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Ad Soyad"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
            />
            <input
              placeholder="Ünvan"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              required
            />
            <input
              placeholder="Telefon"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-muted)' }}>İptal</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--accent)' }}>Kaydet</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => (
            <div key={member.id} className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                  {member.name.charAt(0)}
                </div>
                <button onClick={() => deleteMember(member.id)} className="p-1 rounded hover:opacity-70" style={{ color: 'var(--accent)' }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{member.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{member.title}</p>
              <div className="mt-3 space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {member.phone && <p>{member.phone}</p>}
                {member.email && <p>{member.email}</p>}
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Henüz ekip üyesi eklenmemiş</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

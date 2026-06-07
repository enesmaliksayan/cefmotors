'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Save } from 'lucide-react'

interface Gallery {
  name: string
  address: string
  phone: string
  email: string
  workingHours: string
  about: string
  mapsUrl: string | null
  latitude: number | null
  longitude: number | null
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
  )
}

export default function SettingsPage() {
  const [form, setForm] = useState<Gallery>({
    name: '', address: '', phone: '', email: '', workingHours: '', about: '', mapsUrl: '', latitude: null, longitude: null,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setForm)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Galeri Ayarları</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="rounded-xl p-6 border space-y-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <Field label="Galeri Adı">
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Adres">
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefon">
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>
          <Field label="Çalışma Saatleri">
            <Input value={form.workingHours} onChange={e => setForm({ ...form, workingHours: e.target.value })} placeholder="Hafta içi: 09:00 - 19:00" />
          </Field>
          <Field label="Hakkımızda">
            <Textarea rows={5} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} />
          </Field>
          <Field label="Google Maps URL">
            <Input value={form.mapsUrl ?? ''} onChange={e => setForm({ ...form, mapsUrl: e.target.value })} placeholder="https://www.google.com/maps/place/..." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Enlem (Latitude)">
              <Input type="number" step="any" value={form.latitude ?? ''} onChange={e => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null })} />
            </Field>
            <Field label="Boylam (Longitude)">
              <Input type="number" step="any" value={form.longitude ?? ''} onChange={e => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null })} />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Kaydet
          </button>
          {saved && <span className="text-sm" style={{ color: '#22C55E' }}>Kaydedildi ✓</span>}
        </div>
      </form>
    </div>
  )
}

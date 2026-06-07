'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'

interface CarFormData {
  brand: string
  model: string
  year: number
  price: number
  currency: string
  mileage: number | null
  fuelType: string
  transmission: string
  color: string
  enginePower: string
  description: string
  status: string
  isFeatured: boolean
  isPublished: boolean
}

const defaultForm: CarFormData = {
  brand: '', model: '', year: new Date().getFullYear(), price: 0, currency: 'TL',
  mileage: null, fuelType: '', transmission: '', color: '', enginePower: '',
  description: '', status: 'available', isFeatured: false, isPublished: false,
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
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm transition-colors"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm transition-colors"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      {props.children}
    </select>
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm transition-colors resize-none"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  )
}

export default function CarForm({ carId }: { carId?: string }) {
  const [form, setForm] = useState<CarFormData>(defaultForm)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const isEdit = !!carId

  useEffect(() => {
    if (carId) {
      fetch(`/api/cars/${carId}`)
        .then(res => res.json())
        .then(data => {
          const { images, videos, createdAt, updatedAt, id, ...rest } = data
          setForm(rest)
        })
    }
  }, [carId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    const url = isEdit ? `/api/cars/${carId}` : '/api/cars'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/cars')
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {isEdit ? 'Araç Düzenle' : 'Yeni Araç'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl p-6 border space-y-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Temel Bilgiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Marka">
              <Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required placeholder="BMW" />
            </Field>
            <Field label="Model">
              <Input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required placeholder="X5" />
            </Field>
            <Field label="Yıl">
              <Input type="number" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} required />
            </Field>
            <Field label="Fiyat">
              <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
            </Field>
            <Field label="Para Birimi">
              <Select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                <option>TL</option>
                <option>USD</option>
                <option>EUR</option>
              </Select>
            </Field>
            <Field label="Kilometre">
              <Input type="number" value={form.mileage ?? ''} onChange={e => setForm({ ...form, mileage: e.target.value ? Number(e.target.value) : null })} />
            </Field>
            <Field label="Yakıt Tipi">
              <Select value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })}>
                <option value="">Seçiniz</option>
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Hibrit">Hibrit</option>
                <option value="Elektrik">Elektrik</option>
                <option value="LPG">LPG</option>
              </Select>
            </Field>
            <Field label="Vites">
              <Select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })}>
                <option value="">Seçiniz</option>
                <option value="Manuel">Manuel</option>
                <option value="Otomatik">Otomatik</option>
                <option value="Yarı Otomatik">Yarı Otomatik</option>
              </Select>
            </Field>
            <Field label="Renk">
              <Input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="Siyah" />
            </Field>
            <Field label="Motor Gücü">
              <Input value={form.enginePower} onChange={e => setForm({ ...form, enginePower: e.target.value })} placeholder="3.0L / 250 HP" />
            </Field>
          </div>
        </div>

        <div className="rounded-xl p-6 border space-y-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Açıklama</h2>
          <Textarea rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Araç hakkında detaylı açıklama..." />
        </div>

        <div className="rounded-xl p-6 border space-y-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Durum</h2>
          <div className="flex flex-wrap gap-4">
            <Field label="Durum">
              <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="available">Satışta</option>
                <option value="reserved">Rezerve</option>
                <option value="sold">Satıldı</option>
              </Select>
            </Field>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm" style={{ color: 'var(--text)' }}>Öne Çıkan</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm" style={{ color: 'var(--text)' }}>Yayınla</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Kaydet
          </button>
        </div>
      </form>
    </div>
  )
}

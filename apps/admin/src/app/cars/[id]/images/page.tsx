'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Trash2, GripVertical, Star } from 'lucide-react'

interface Car {
  id: number
  brand: string
  model: string
  images: { id: number; url: string; isPrimary: boolean; order: number }[]
  videos: { id: number; url: string; title: string | null }[]
}

export default function CarImagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [car, setCar] = useState<Car | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/cars/${id}`).then(res => res.json()).then(setCar)
  }, [id])

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('carId', id)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) { alert('Yükleme başarısız'); return }
    const updated = await fetch(`/api/cars/${id}`).then(res => res.json())
    setCar(updated)
  }

  async function deleteImage(imageId: number) {
    await fetch(`/api/upload/${imageId}`, { method: 'DELETE' })
    const updated = await fetch(`/api/cars/${id}`).then(res => res.json())
    setCar(updated)
  }

  async function setPrimary(imageId: number) {
    await fetch(`/api/upload/${imageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPrimary: true }),
    })
    const updated = await fetch(`/api/cars/${id}`).then(res => res.json())
    setCar(updated)
  }

  async function addVideo() {
    if (!videoUrl) return
    await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videos: [...(car?.videos || []), { url: videoUrl, title: videoTitle || null }],
      }),
    })
    setVideoUrl('')
    setVideoTitle('')
    const updated = await fetch(`/api/cars/${id}`).then(res => res.json())
    setCar(updated)
  }

  if (!car) return null

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {car.brand} {car.model} - Medya
        </h1>
      </div>

      <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Görseller</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {car.images.map(img => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden border aspect-[4/3]"
              style={{ borderColor: 'var(--border)' }}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-start justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                <button
                  onClick={() => setPrimary(img.id)}
                  className="p-1.5 rounded-full transition-colors"
                  style={{ color: img.isPrimary ? '#C5A55A' : '#fff' }}
                  title={img.isPrimary ? 'Öne Çıkan' : 'Öne Çıkan Yap'}
                >
                  <Star className="w-4 h-4" fill={img.isPrimary ? '#C5A55A' : 'none'} />
                </button>
                <button
                  onClick={() => deleteImage(img.id)}
                  className="p-1.5 rounded-full text-white hover:text-accent transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {img.isPrimary && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#C5A55A', color: '#000' }}>
                  Öne Çıkan
                </div>
              )}
            </div>
          ))}
        </div>

        <label className="flex items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:opacity-70" style={{ borderColor: 'var(--border)' }}>
          <Upload className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Görsel Yükle</span>
          <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
        </label>
      </div>

      <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Videolar</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="YouTube / Vimeo URL"
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          <input
            type="text"
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            placeholder="Başlık (opsiyonel)"
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          <button
            onClick={addVideo}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Ekle
          </button>
        </div>

        <div className="space-y-2">
          {car.videos.map((v, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{v.title || `Video ${i + 1}`}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.url}</span>
              </div>
              <button className="p-1 rounded hover:opacity-70" style={{ color: 'var(--accent)' }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

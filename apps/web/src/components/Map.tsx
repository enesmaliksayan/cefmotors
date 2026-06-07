'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

const icon = new L.DivIcon({
  className: 'custom-marker',
  html: '<div style="background:#E63946;width:24px;height:24px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const istanbulPos: [number, number] = [41.0082, 28.9784]

function MapViewport({ coords }: { coords: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(coords, 16)
  }, [map, coords])
  return null
}

export default function Map() {
  const [coords, setCoords] = useState<[number, number]>(istanbulPos)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d?.latitude && d?.longitude) {
          setCoords([d.latitude, d.longitude])
        }
      })
      .catch(() => {})
  }, [])

  return (
    <MapContainer
      center={coords}
      zoom={16}
      className="w-full h-full z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewport coords={coords} />
      <Marker position={coords} icon={icon}>
        <Popup>
          CEF MOTORS
        </Popup>
      </Marker>
    </MapContainer>
  )
}
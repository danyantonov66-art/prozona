"use client"

import { useEffect, useRef } from "react"

interface Specialist {
  id: string
  name: string
  city: string
  lat: number
  lng: number
}

interface Props {
  specialists: Specialist[]
  locale: string
}

export default function SpecialistsMap({ specialists, locale }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const L = require("leaflet")
    require("leaflet/dist/leaflet.css")

    // Fix default marker icons
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    })

    const map = L.map(mapRef.current).setView([42.7, 25.5], 7)
    mapInstance.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map)

    specialists.forEach((s) => {
      if (!s.lat || !s.lng) return
      const marker = L.marker([s.lat, s.lng])
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:150px">
            <strong style="font-size:14px">${s.name}</strong><br/>
            <span style="color:#666;font-size:12px">📍 ${s.city}</span><br/>
            <a href="/${locale}/specialist/${s.id}" 
               style="color:#1DB954;font-size:12px;font-weight:bold;text-decoration:none">
              Виж профила →
            </a>
          </div>
        `)
    })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [specialists, locale])

  return (
    <div
      ref={mapRef}
      style={{ height: "500px", width: "100%", borderRadius: "16px", zIndex: 1 }}
    />
  )
}
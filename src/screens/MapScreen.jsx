import { useEffect, useRef } from "react"
import L from "leaflet"
import { START, LANDMARKS } from "@/data"

const SPEED = 0.00002 // degrees per tick
const ARRIVE = 0.00008 // how close counts as arrived

// avatar position survives leaving the map
let spot = L.latLng(START[0], START[1])
let lastHit = null // landmark we are standing on, so we do not re-trigger

const icon = (emoji, size) =>
  L.divIcon({ html: `<div style="font-size:${size}px;line-height:1">${emoji}</div>`, className: "", iconSize: [size, size] })

export default function MapScreen({ onArrive, paused }) {
  const el = useRef()
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const map = L.map(el.current, { zoomControl: false, dragging: false, touchZoom: false, doubleClickZoom: false })
    map.setView(spot, 17)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map)

    const me = L.marker(spot, { icon: icon("🚶‍♀️", 44), zIndexOffset: 1000 }).addTo(map)
    let target = null

    LANDMARKS.forEach((l) => {
      L.marker([l.lat, l.lng], { icon: icon("🌱", 36) }).addTo(map).on("click", () => (target = L.latLng(l.lat, l.lng)))
    })
    map.on("click", (e) => (target = e.latlng))

    const timer = setInterval(() => {
      if (!target || pausedRef.current) return
      const dLat = target.lat - spot.lat
      const dLng = target.lng - spot.lng
      const dist = Math.hypot(dLat, dLng)
      if (dist < SPEED) return (target = null)

      spot = L.latLng(spot.lat + (dLat / dist) * SPEED, spot.lng + (dLng / dist) * SPEED)
      me.setLatLng(spot)
      map.panTo(spot, { animate: false })

      const near = LANDMARKS.find((l) => Math.hypot(l.lat - spot.lat, l.lng - spot.lng) < ARRIVE)
      if (near && near.id !== lastHit) {
        lastHit = near.id
        target = null
        onArrive(near)
      } else if (!near) {
        lastHit = null
      }
    }, 50)

    return () => {
      clearInterval(timer)
      map.remove()
    }
  }, [])

  return (
    <div className="relative h-full">
      <div ref={el} className="h-full" />
      <p className="absolute inset-x-0 top-12 z-[500] text-center text-sm text-soil/70">tap the map to walk. tap a 🌱 to visit.</p>
    </div>
  )
}

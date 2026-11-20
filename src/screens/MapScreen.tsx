import { useCallback, useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { Person, SignSprout } from '@/art'
import { Button } from '@/components/ui/button'
import { CROPS, LANDMARK_COOLDOWN_MS, LANDMARK_M, PICKUP_M, distanceM, type MapCrop, type Pos } from '@/game'
import { LANDMARKS, START, type Landmark } from '@/landmarks'
import { useLatest } from '@/hooks'

const TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const CREDIT = '© OpenStreetMap contributors © CARTO'

type Props = {
  pos: Pos | null
  walking: boolean
  error: string
  practice: boolean
  crops: MapCrop[]
  visits: Record<string, number>
  onRetry: () => void
  onPracticeMove: (p: Pos) => void
  onCrop: (c: MapCrop) => void
  onLandmark: (l: Landmark) => void
}

export function MapScreen(props: Props) {
  const { pos, walking, error, practice, crops, visits } = props
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const pins = useRef<L.LayerGroup | null>(null)
  const me = useRef<L.Marker | null>(null)
  const toastTimer = useRef(0)
  const [toast, setToast] = useState('')
  const latest = useLatest(props) // click handlers read the newest props from here

  const say = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2500)
  }, [])

  // Make the map once.
  useEffect(() => {
    if (!box.current) return
    const m = L.map(box.current, { zoomControl: false }).setView([START.lat, START.lng], 17)
    L.tileLayer(TILES, { maxZoom: 19, attribution: CREDIT }).addTo(m)
    pins.current = L.layerGroup().addTo(m)
    map.current = m
    return () => {
      m.remove()
      map.current = null
      pins.current = null
      me.current = null
    }
  }, [])

  // Practice mode: tap the map to walk there.
  useEffect(() => {
    const m = map.current
    if (!m || !practice) return
    const onClick = (e: L.LeafletMouseEvent) => latest.current.onPracticeMove({ lat: e.latlng.lat, lng: e.latlng.lng })
    m.on('click', onClick)
    return () => {
      m.off('click', onClick)
    }
  }, [practice, latest])

  // Crops and landmark signs.
  useEffect(() => {
    const group = pins.current
    if (!group) return
    group.clearLayers()

    for (const l of LANDMARKS) {
      const recent = Date.now() - (visits[l.id] ?? 0) < LANDMARK_COOLDOWN_MS
      const icon = L.divIcon({ className: '', html: renderToStaticMarkup(<SignSprout dim={recent} />), iconSize: [48, 48] })
      L.marker([l.lat, l.lng], { icon, alt: l.name, keyboard: false })
        .on('click', () => {
          const { pos, onLandmark } = latest.current
          if (!pos) return say('Finding you…')
          if (Date.now() - (latest.current.visits[l.id] ?? 0) < LANDMARK_COOLDOWN_MS) return say('You already visited. Come back later!')
          const d = distanceM(pos, l)
          if (d > LANDMARK_M) return say(`Walk closer to ${l.name}! ${Math.round(d)} m away`)
          onLandmark(l)
        })
        .addTo(group)
    }

    for (const c of crops) {
      const icon = L.divIcon({ className: '', html: `<div class="text-4xl leading-none">${CROPS[c.type].emoji}</div>`, iconSize: [40, 40] })
      L.marker([c.lat, c.lng], { icon, alt: CROPS[c.type].name, keyboard: false })
        .on('click', () => {
          const { pos, onCrop } = latest.current
          if (!pos) return say('Finding you…')
          const d = distanceM(pos, c)
          if (d > PICKUP_M) return say(`Walk closer! ${Math.round(d)} m away`)
          onCrop(c)
        })
        .addTo(group)
    }
  }, [crops, visits, latest, say])

  // My avatar. It walks while I move and stands when I stop.
  useEffect(() => {
    const m = map.current
    if (!m || !pos) return
    const icon = L.divIcon({ className: '', html: renderToStaticMarkup(<Person walking={walking} size={84} />), iconSize: [49, 84], iconAnchor: [24, 80] })
    if (me.current) {
      me.current.setLatLng([pos.lat, pos.lng]).setIcon(icon)
    } else {
      me.current = L.marker([pos.lat, pos.lng], { icon, interactive: false, keyboard: false, zIndexOffset: 1000 }).addTo(m)
    }
    m.panTo([pos.lat, pos.lng])
  }, [pos, walking])

  const notice = error || (!pos ? (practice ? 'Practice mode: tap the map to place yourself.' : 'Finding you…') : '')

  return (
    <div className="relative h-full">
      <div ref={box} className="isolate h-full w-full" />
      {(toast || notice) && (
        <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top)+1rem)] z-[1000] flex flex-col items-center gap-2">
          <p className="rounded-full bg-cream px-5 py-2 text-center shadow">{toast || notice}</p>
          {error && !toast && (
            <Button size="sm" onClick={props.onRetry}>
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

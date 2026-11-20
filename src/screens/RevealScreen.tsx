import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { photoUrl, type Landmark } from '@/landmarks'
import { useLatest } from '@/hooks'

const COVER = '#b3ecff'
const BRUSH = 38
const NEEDED = 0.4 // fraction of the cover that must be wiped away

export function RevealScreen({ place, onDone }: { place: Landmark; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const last = useRef<{ x: number; y: number } | null>(null)
  const moves = useRef(0)
  const finished = useRef(false)
  const [photoFailed, setPhotoFailed] = useState(false)
  const done = useLatest(onDone)
  const src = photoUrl(place)

  useEffect(() => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    c.width = c.clientWidth
    c.height = c.clientHeight
    ctx.fillStyle = COVER
    ctx.fillRect(0, 0, c.width, c.height)
  }, [])

  function stamp(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const g = ctx.createRadialGradient(x, y, BRUSH * 0.3, x, y, BRUSH)
    g.addColorStop(0, 'rgba(0,0,0,1)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2)
    ctx.fill()
  }

  function clearedFraction(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 64) {
      total++
      if (data[i] < 60) clear++
    }
    return clear / total
  }

  function swipe(e: PointerEvent<HTMLCanvasElement>) {
    if (e.buttons === 0 || finished.current) return
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const rect = c.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.globalCompositeOperation = 'destination-out'
    const from = last.current ?? { x, y }
    const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / 10))
    for (let i = 1; i <= steps; i++) stamp(ctx, from.x + ((x - from.x) * i) / steps, from.y + ((y - from.y) * i) / steps)
    last.current = { x, y }
    moves.current++
    if (moves.current % 12 === 0 && clearedFraction(c, ctx) > NEEDED) {
      finished.current = true
      done.current()
    }
  }

  return (
    <div className="relative h-full overflow-hidden bg-sky-pale">
      {src && !photoFailed ? (
        <img src={src} alt={place.name} onError={() => setPhotoFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-amber-200 to-sky p-10 text-center font-display text-4xl font-bold">{place.name}</div>
      )}
      <canvas
        ref={canvas}
        aria-label="Swipe to uncover the landmark"
        className="absolute inset-0 h-full w-full touch-none"
        onPointerDown={(e) => {
          last.current = null
          e.currentTarget.setPointerCapture(e.pointerId)
          swipe(e)
        }}
        onPointerMove={swipe}
        onPointerUp={() => (last.current = null)}
      />
      <p className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+3.5rem)] text-center text-lg">Swipe to uncover the landmark!</p>
    </div>
  )
}

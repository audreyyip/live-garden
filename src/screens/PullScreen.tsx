import { useCallback, useEffect, useRef, useState } from 'react'
import { askMotionPermission, needsMotionPermission } from '@/motion'
import { useLatest } from '@/hooks'
import { CropArt } from '@/art'
import { Button } from '@/components/ui/button'
import { CROPS, type CropType } from '@/game'

const SHAKES_NEEDED = 8
const SHAKE_STRENGTH = 12

export function PullScreen({ crop, vibrate, onDone }: { crop: CropType; vibrate: boolean; onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [needsPermission, setNeedsPermission] = useState(needsMotionPermission)
  const finished = useRef(false)
  const done = useLatest(onDone)

  const bump = useCallback(() => {
    if (vibrate) navigator.vibrate?.(20)
    setCount((c) => c + 1)
  }, [vibrate])

  useEffect(() => {
    if (count >= SHAKES_NEEDED && !finished.current) {
      finished.current = true
      done.current()
    }
  }, [count, done])

  // Phone shake: count a jump in total acceleration.
  useEffect(() => {
    if (needsPermission) return
    let last = 0
    let lastShakeAt = 0
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity
      if (!a) return
      const strength = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0)
      const now = Date.now()
      if (Math.abs(strength - last) > SHAKE_STRENGTH && now - lastShakeAt > 200) {
        lastShakeAt = now
        bump()
      }
      last = strength
    }
    window.addEventListener('devicemotion', onMotion)
    return () => window.removeEventListener('devicemotion', onMotion)
  }, [needsPermission, bump])

  const isCarrot = crop === 'carrot'
  const base = isCarrot ? 6 : 120
  const name = CROPS[crop].name.toLowerCase()

  return (
    <div className="relative h-full overflow-hidden bg-linear-to-b from-white to-sky">
      <p className="px-6 pt-[calc(env(safe-area-inset-top)+3.5rem)] text-center text-lg">
        {count === 0 ? `shake your phone to get the ${name}!` : 'keep going! almost there!'}
      </p>
      {needsPermission && (
        <div className="mt-4 flex justify-center">
          <Button size="sm" onClick={() => askMotionPermission().then((ok) => setNeedsPermission(!ok))}>
            Turn on shake
          </Button>
        </div>
      )}
      <button
        aria-label={`Tug the ${name}`}
        onClick={bump}
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: base + count * 9 }}
      >
        <div key={count} className={count > 0 ? 'wiggle' : ''}>
          <CropArt type={crop} size={isCarrot ? 280 : 150} />
        </div>
        {count > 0 && (
          <svg viewBox="0 0 260 120" className="pointer-events-none absolute -left-12 top-10 w-[calc(100%+6rem)]" fill="none" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 80 Q20 100 14 118 M30 70 Q42 98 34 116" />
            <path d="M232 18 Q256 40 248 62 M214 30 Q232 48 226 66" />
          </svg>
        )}
      </button>
      <div className="absolute inset-x-0 bottom-0 h-44 bg-soil" />
    </div>
  )
}

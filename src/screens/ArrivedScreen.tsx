import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { ItemIcon, SignSprout } from '@/art'
import { photoUrl, type Landmark } from '@/landmarks'
import { useLatest } from '@/hooks'
import { cn } from '@/lib/utils'
import type { ItemKey } from '@/game'

// Position (%) and size (px) of each bubble, copied from the Figma frame.
const BUBBLES: { item: ItemKey; left: number; top: number; size: number; icon: number }[] = [
  { item: 'carrot', left: 4, top: 39.5, size: 150, icon: 80 },
  { item: 'tomato', left: 63, top: 40.5, size: 80, icon: 44 },
  { item: 'corn', left: 41, top: 48, size: 104, icon: 60 },
  { item: 'speed', left: 69, top: 50.5, size: 90, icon: 44 },
  { item: 'instant', left: 22, top: 59, size: 70, icon: 36 },
]

type Props = { place: Landmark; taken: ItemKey[]; onPick: (item: ItemKey) => void; onFinish: () => void }

export function ArrivedScreen({ place, taken, onPick, onFinish }: Props) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const finish = useLatest(onFinish)
  const sent = useRef(false)
  const src = photoUrl(place)

  useEffect(() => {
    if (taken.length >= BUBBLES.length && !sent.current) {
      sent.current = true
      const id = setTimeout(() => finish.current(), 600)
      return () => clearTimeout(id)
    }
  }, [taken, finish])

  return (
    <div className="relative h-full overflow-hidden bg-linear-to-br from-amber-200 to-sky">
      {src && !photoFailed && <img src={src} alt="" onError={() => setPhotoFailed(true)} className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-x-0 top-0 bg-linear-to-b from-white to-white/0 px-6 pb-8 pt-[calc(env(safe-area-inset-top)+3.5rem)] text-center text-lg">
        You’ve arrived at {place.name}!
      </div>
      <button
        aria-label="Finish and see rewards"
        onClick={onFinish}
        className="absolute left-1/2 top-[16%] grid size-[180px] -translate-x-1/2 place-items-center rounded-full bg-amber-200"
      >
        <SignSprout size={96} />
      </button>
      {BUBBLES.map((b) => {
        const got = taken.includes(b.item)
        return (
          <button
            key={b.item}
            disabled={got}
            onClick={() => onPick(b.item)}
            aria-label={got ? `${b.item} collected` : `Collect ${b.item}`}
            className={cn('absolute grid place-items-center rounded-full bg-sky-pale/60 backdrop-blur-[2px] transition-opacity', got && 'opacity-40')}
            style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size }}
          >
            {got ? <Check size={b.icon} /> : <ItemIcon item={b.item} size={b.icon} />}
          </button>
        )
      })}
    </div>
  )
}

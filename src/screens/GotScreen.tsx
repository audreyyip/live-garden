import { useEffect } from 'react'
import { Burst, CropArt } from '@/art'
import { CROPS, type CropType } from '@/game'
import { useLatest } from '@/hooks'

export function GotScreen({ crop, onDone }: { crop: CropType; onDone: () => void }) {
  const done = useLatest(onDone)
  useEffect(() => {
    const id = setTimeout(() => done.current(), 2200)
    return () => clearTimeout(id)
  }, [done])

  return (
    <button onClick={onDone} className="relative block h-full w-full overflow-hidden bg-linear-to-b from-white to-sky text-soil" aria-label="Continue">
      <Burst />
      <span className="absolute left-8 top-[11%] -rotate-12 font-display text-7xl font-bold">You’ve</span>
      <span className="absolute left-[48%] top-[19%] -rotate-6 font-display text-4xl font-bold">got a</span>
      <span className="absolute left-[18%] top-[32%] rotate-[-25deg]">
        <CropArt type={crop} size={300} />
      </span>
      <span className="absolute bottom-[12%] left-8 -rotate-6 font-display text-8xl font-bold">{CROPS[crop].name}!</span>
    </button>
  )
}

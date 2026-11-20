import { useState } from 'react'
import { CropArt, GardenScene, ItemIcon, Person } from '@/art'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useNow } from '@/hooks'
import { cn } from '@/lib/utils'
import { CROPS, CROP_TYPES, DAY_MS, LILY_GOAL, harvestAt, instantGrow, isReady, plantAt, speedUp, water, type CropType, type Game } from '@/game'

type Props = { game: Game; update: (fn: (g: Game) => Game) => void }

function clock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function GardenScreen({ game, update }: Props) {
  const now = useNow()
  const [seed, setSeed] = useState<CropType>('carrot')
  const tasks = [
    { text: `Grow ${LILY_GOAL} carrots for your neighbor Lily`, done: game.harvested.carrot >= LILY_GOAL, note: `${Math.min(game.harvested.carrot, LILY_GOAL)}/${LILY_GOAL}` },
    { text: 'Water your carrots', done: now - game.wateredAt < DAY_MS, note: '' },
  ]
  const growing = game.plots.some((p) => p && !isReady(p, now))

  return (
    <div className="relative h-full overflow-hidden bg-linear-to-b from-white to-sky">
      <h1 className="pt-[calc(env(safe-area-inset-top)+3rem)] text-center text-lg">Garden Tasks</h1>
      <ul className="relative z-10 mx-8 mt-4 space-y-3 rounded-3xl bg-cream px-5 py-5">
        {tasks.map((t) => (
          <li key={t.text} className="flex items-center justify-between gap-3">
            <span>
              {t.text} {t.note && <span className="text-soil/60">({t.note})</span>}
            </span>
            <Checkbox checked={t.done} disabled aria-label={t.text} />
          </li>
        ))}
      </ul>

      <div className="absolute inset-x-0 bottom-[170px]">
        <GardenScene />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[174px] bg-soil" />

      <button aria-label="Water your carrots" onClick={() => update((g) => water(g, Date.now()))} className="absolute bottom-[150px] left-[16%]">
        <Person can size={220} />
      </button>

      <div className="absolute inset-x-6 bottom-[120px] flex justify-around">
        {game.plots.map((p, i) => {
          const ready = !!p && isReady(p, now)
          const label = !p ? 'Plant a seed' : ready ? `Harvest ${CROPS[p.type].name}` : `${CROPS[p.type].name} is growing`
          return (
            <button
              key={i}
              aria-label={label}
              disabled={!!p && !ready}
              onClick={() => update((g) => (p ? harvestAt(g, i, Date.now()) : plantAt(g, i, seed, Date.now())))}
              className="grid h-24 w-16 place-items-end justify-items-center"
            >
              {!p && <span className="mb-4 h-5 w-14 rounded-full bg-black/25" />}
              {p && !ready && (
                <span className="mb-2 text-center text-cream">
                  <span className="block text-4xl">🌱</span>
                  <span className="text-xs">{clock(p.growMs - (now - p.plantedAt))}</span>
                </span>
              )}
              {p && ready && <CropArt type={p.type} size={84} />}
            </button>
          )
        })}
      </div>

      <div className="absolute inset-x-0 bottom-[92px] flex flex-wrap justify-center gap-2 px-4">
        {CROP_TYPES.map((type) => (
          <Button key={type} size="sm" variant="soft" aria-pressed={seed === type} aria-label={`Plant ${CROPS[type].name}`} onClick={() => setSeed(type)} className={cn('px-3', seed === type && 'ring-2 ring-leaf')}>
            {CROPS[type].emoji} {game.inventory[type]}
          </Button>
        ))}
        <Button size="sm" variant="soft" className="px-3" aria-label="Use Increase Grow Speed" disabled={!growing || game.inventory.speed < 1} onClick={() => update((g) => speedUp(g, Date.now()))}>
          <ItemIcon item="speed" size={18} /> {game.inventory.speed}
        </Button>
        <Button size="sm" variant="soft" className="px-3" aria-label="Use Instant Grow" disabled={!growing || game.inventory.instant < 1} onClick={() => update((g) => instantGrow(g, Date.now()))}>
          <ItemIcon item="instant" size={18} /> {game.inventory.instant}
        </Button>
      </div>
    </div>
  )
}

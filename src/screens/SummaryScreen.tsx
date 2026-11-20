import { ItemIcon } from '@/art'
import { Button } from '@/components/ui/button'
import { ITEMS, type ItemKey } from '@/game'

export function SummaryScreen({ items, onDone }: { items: ItemKey[]; onDone: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-linear-to-b from-white to-sky px-5">
      <h1 className="font-display text-3xl font-bold">Reward Summary</h1>
      <ul className="w-full space-y-4 rounded-[32px] bg-cream p-8">
        {items.length === 0 && <li className="text-center">Nothing collected this time.</li>}
        {items.map((item) => (
          <li key={item} className="flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-pale">
              <ItemIcon item={item} size={22} />
            </span>
            <span className="flex-1">{ITEMS[item].label} x 1</span>
            <span>+{ITEMS[item].xp} XP</span>
          </li>
        ))}
      </ul>
      <Button onClick={onDone}>Okay!</Button>
    </div>
  )
}

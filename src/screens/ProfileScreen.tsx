import { Button } from '@/components/ui/button'
import { ItemIcon } from '@/art'
import { ITEMS, levelOf, newGame, type Game, type ItemKey } from '@/game'

type Props = { game: Game; update: (fn: (g: Game) => Game) => void }

export function ProfileScreen({ game, update }: Props) {
  const level = levelOf(game.xp)
  const into = game.xp % 200
  const toggle = (key: 'vibrate' | 'practice') => update((g) => ({ ...g, settings: { ...g.settings, [key]: !g.settings[key] } }))
  const items = Object.keys(ITEMS) as ItemKey[]

  return (
    <div className="h-full overflow-y-auto bg-linear-to-b from-white to-sky px-5 pb-32 pt-[calc(env(safe-area-inset-top)+3rem)]">
      <h1 className="text-center text-lg">Profile</h1>

      <section className="mt-4 rounded-3xl bg-cream p-5">
        <p className="font-display text-2xl font-bold">Level {level}</p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="XP to next level" aria-valuemin={0} aria-valuemax={200} aria-valuenow={into}>
          <div className="h-full rounded-full bg-leaf" style={{ width: `${(into / 200) * 100}%` }} />
        </div>
        <p className="mt-1 text-sm text-soil/70">{game.xp} XP total</p>
      </section>

      <section className="mt-4 rounded-3xl bg-cream p-5">
        <h2 className="mb-3 text-lg">Bag</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <ItemIcon item={item} size={22} />
              <span className="flex-1">{ITEMS[item].label}</span>
              <span>{game.inventory[item]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 space-y-3 rounded-3xl bg-cream p-5">
        <h2 className="text-lg">Settings</h2>
        <Button size="sm" variant="soft" className="w-full justify-between bg-white" aria-pressed={game.settings.vibrate} onClick={() => toggle('vibrate')}>
          Vibration <span>{game.settings.vibrate ? 'On' : 'Off'}</span>
        </Button>
        <Button size="sm" variant="soft" className="w-full justify-between bg-white" aria-pressed={game.settings.practice} onClick={() => toggle('practice')}>
          Practice mode (tap map to move) <span>{game.settings.practice ? 'On' : 'Off'}</span>
        </Button>
        <Button
          size="sm"
          variant="soft"
          className="w-full bg-white"
          onClick={() => {
            if (window.confirm('Erase all progress on this phone?')) update(() => newGame())
          }}
        >
          Reset game
        </Button>
      </section>
    </div>
  )
}

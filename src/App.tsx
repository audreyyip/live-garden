import { useCallback, useEffect, useState } from 'react'
import { House, Map as MapIcon, Sprout, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { giveItems, loadGame, refreshSpawns, saveGame, type CropType, type ItemKey, type MapCrop, type Pos } from '@/game'
import type { Landmark } from '@/landmarks'
import { useLocation } from '@/useLocation'
import { MapScreen } from '@/screens/MapScreen'
import { GardenScreen } from '@/screens/GardenScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { PullScreen } from '@/screens/PullScreen'
import { GotScreen } from '@/screens/GotScreen'
import { RevealScreen } from '@/screens/RevealScreen'
import { ArrivedScreen } from '@/screens/ArrivedScreen'
import { SummaryScreen } from '@/screens/SummaryScreen'

type Tab = 'map' | 'garden' | 'home' | 'profile'
// What is on top of the tabs right now (null = just the tabs).
type Step = null | 'pull' | 'got' | 'reveal' | 'arrived' | 'summary'

const TABS = [
  { id: 'map', label: 'Map', Icon: MapIcon },
  { id: 'garden', label: 'Garden', Icon: Sprout },
  { id: 'home', label: 'Home', Icon: House },
  { id: 'profile', label: 'Profile', Icon: User },
] as const

export default function App() {
  const [game, setGame] = useState(loadGame)
  const [tab, setTab] = useState<Tab>('map')
  const [step, setStep] = useState<Step>(null)
  const [crop, setCrop] = useState<CropType>('carrot') // crop being pulled
  const [mapCrop, setMapCrop] = useState<MapCrop | null>(null) // set when it came from the map
  const [place, setPlace] = useState<Landmark | null>(null) // landmark being visited
  const [taken, setTaken] = useState<ItemKey[]>([]) // rewards grabbed at that landmark

  useEffect(() => saveGame(game), [game])

  const onMove = useCallback(
    (p: Pos) =>
      setGame((g) => {
        const spawns = refreshSpawns(g.spawns, p, Date.now())
        return spawns === g.spawns ? g : { ...g, spawns }
      }),
    [],
  )
  const { pos, walking, error, move, retry } = useLocation(game.settings.practice, onMove)

  // New crops appear over time even if I stand still.
  useEffect(() => {
    if (!pos) return
    const id = setInterval(() => onMove(pos), 60_000)
    return () => clearInterval(id)
  }, [pos, onMove])

  function pickMapCrop(c: MapCrop) {
    setMapCrop(c)
    setCrop(c.type)
    setStep('pull')
  }

  function startVisit(l: Landmark) {
    setPlace(l)
    setTaken([])
    setStep('reveal')
  }

  // Landmark bubbles: crops need a shake, boosts are taken right away.
  function pickBubble(item: ItemKey) {
    if (item === 'speed' || item === 'instant') return setTaken((t) => [...t, item])
    setMapCrop(null)
    setCrop(item)
    setStep('pull')
  }

  function pulled() {
    if (game.settings.vibrate) navigator.vibrate?.([60, 40, 60])
    setStep('got')
  }

  function gotIt() {
    if (mapCrop) {
      const c = mapCrop
      setGame((g) => ({ ...giveItems(g, [c.type]), spawns: g.spawns.filter((s) => s.id !== c.id) }))
      setMapCrop(null)
      setStep(null)
    } else {
      setTaken((t) => [...t, crop])
      setStep('arrived')
    }
  }

  function finishVisit() {
    const id = place?.id
    setGame((g) => ({ ...giveItems(g, taken), visits: id ? { ...g.visits, [id]: Date.now() } : g.visits }))
    setStep(null)
  }

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-white font-body text-soil">
      <MapScreen
        pos={pos}
        walking={walking}
        error={error}
        practice={game.settings.practice}
        crops={game.spawns}
        visits={game.visits}
        onRetry={retry}
        onPracticeMove={move}
        onCrop={pickMapCrop}
        onLandmark={startVisit}
      />

      {tab === 'garden' && (
        <div className="absolute inset-0 z-[1100]">
          <GardenScreen game={game} update={setGame} />
        </div>
      )}
      {tab === 'home' && (
        <div className="absolute inset-0 z-[1100] grid place-items-center bg-linear-to-b from-white to-sky px-10 text-center text-lg">
          Your home is coming soon.
        </div>
      )}
      {tab === 'profile' && (
        <div className="absolute inset-0 z-[1100]">
          <ProfileScreen game={game} update={setGame} />
        </div>
      )}

      <nav className="absolute inset-x-0 bottom-0 z-[1200] flex h-20 items-center justify-around rounded-t-[40px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} aria-label={label} aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)} className={cn('p-3', tab === id ? 'text-soil' : 'text-soil/40')}>
            <Icon size={34} strokeWidth={1.6} />
          </button>
        ))}
      </nav>

      {step && (
        <div className="absolute inset-0 z-[2000]">
          {step === 'pull' && <PullScreen crop={crop} vibrate={game.settings.vibrate} onDone={pulled} />}
          {step === 'got' && <GotScreen crop={crop} onDone={gotIt} />}
          {step === 'reveal' && place && <RevealScreen place={place} onDone={() => setStep('arrived')} />}
          {step === 'arrived' && place && <ArrivedScreen place={place} taken={taken} onPick={pickBubble} onFinish={() => setStep('summary')} />}
          {step === 'summary' && <SummaryScreen items={taken} onDone={finishVisit} />}
        </div>
      )}
    </div>
  )
}

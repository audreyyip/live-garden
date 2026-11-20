// All game rules and saved state live here. No React in this file.

export type CropType = 'carrot' | 'tomato' | 'corn'
export type ItemKey = CropType | 'speed' | 'instant'
export type Pos = { lat: number; lng: number }
export type MapCrop = Pos & { id: string; type: CropType; bornAt: number }
export type Plot = { type: CropType; plantedAt: number; growMs: number }

export type Game = {
  xp: number
  inventory: Record<ItemKey, number>
  harvested: Record<CropType, number>
  plots: (Plot | null)[]
  wateredAt: number
  spawns: MapCrop[]
  visits: Record<string, number> // landmark id -> time last visited
  settings: { vibrate: boolean; practice: boolean }
}

export const CROP_TYPES: CropType[] = ['carrot', 'tomato', 'corn']
export const CROPS: Record<CropType, { name: string; emoji: string }> = {
  carrot: { name: 'Carrot', emoji: '🥕' },
  tomato: { name: 'Tomato', emoji: '🍅' },
  corn: { name: 'Corn', emoji: '🌽' },
}
export const ITEMS: Record<ItemKey, { label: string; xp: number }> = {
  carrot: { label: 'Carrots', xp: 25 },
  tomato: { label: 'Tomato', xp: 25 },
  corn: { label: 'Corn', xp: 25 },
  speed: { label: 'Increase Grow Speed', xp: 50 },
  instant: { label: 'Instant Grow', xp: 100 },
}

// Tweak these to change how the game feels.
export const PICKUP_M = 40 // how close you must be to a crop
export const LANDMARK_M = 50 // how close you must be to a landmark
export const LANDMARK_COOLDOWN_MS = 6 * 60 * 60 * 1000
export const SPAWN_COUNT = 6
export const SPAWN_RADIUS_M = 120
export const SPAWN_MAX_AGE_MS = 10 * 60 * 1000
export const GROW_MS = 10 * 60 * 1000
export const WATER_COOLDOWN_MS = 60 * 60 * 1000
export const DAY_MS = 24 * 60 * 60 * 1000
export const LILY_GOAL = 10

export function newGame(): Game {
  return {
    xp: 0,
    inventory: { carrot: 2, tomato: 0, corn: 0, speed: 0, instant: 0 },
    harvested: { carrot: 0, tomato: 0, corn: 0 },
    plots: [null, null, null, null],
    wateredAt: 0,
    spawns: [],
    visits: {},
    settings: { vibrate: true, practice: false },
  }
}

const KEY = 'garden-go-v1'

export function loadGame(): Game {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...newGame(), ...JSON.parse(raw) }
  } catch {
    // bad or missing save: start fresh
  }
  return newGame()
}

export function saveGame(g: Game) {
  try {
    localStorage.setItem(KEY, JSON.stringify(g))
  } catch {
    // storage full or blocked: keep playing without saving
  }
}

export function levelOf(xp: number) {
  return Math.floor(xp / 200) + 1
}

// ---------- map ----------

export function distanceM(a: Pos, b: Pos) {
  const R = 6371000
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function randomNear(p: Pos, maxM: number): Pos {
  const r = 20 + Math.random() * (maxM - 20)
  const angle = Math.random() * 2 * Math.PI
  return {
    lat: p.lat + (r * Math.sin(angle)) / 111320,
    lng: p.lng + (r * Math.cos(angle)) / (111320 * Math.cos((p.lat * Math.PI) / 180)),
  }
}

// Drops old or far crops, adds new ones near me. Returns the same array if nothing changed.
export function refreshSpawns(crops: MapCrop[], me: Pos, now: number): MapCrop[] {
  const keep = crops.filter((c) => now - c.bornAt < SPAWN_MAX_AGE_MS && distanceM(c, me) < SPAWN_RADIUS_M * 2)
  if (keep.length >= SPAWN_COUNT) return keep.length === crops.length ? crops : keep
  const out = [...keep]
  while (out.length < SPAWN_COUNT) {
    const type = CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)]
    out.push({ ...randomNear(me, SPAWN_RADIUS_M), id: `${now}-${Math.random().toString(36).slice(2, 7)}`, type, bornAt: now })
  }
  return out
}

// ---------- rewards ----------

export function giveItems(g: Game, items: ItemKey[]): Game {
  const inventory = { ...g.inventory }
  let xp = g.xp
  for (const item of items) {
    inventory[item] += 1
    xp += ITEMS[item].xp
  }
  return { ...g, inventory, xp }
}

// ---------- garden ----------

export function isReady(p: Plot, now: number) {
  return now - p.plantedAt >= p.growMs
}

export function plantAt(g: Game, i: number, type: CropType, now: number): Game {
  if (g.plots[i] || g.inventory[type] < 1) return g
  return {
    ...g,
    inventory: { ...g.inventory, [type]: g.inventory[type] - 1 },
    plots: g.plots.map((p, j) => (j === i ? { type, plantedAt: now, growMs: GROW_MS } : p)),
  }
}

// Harvest gives 2 back: one to replant, one extra.
export function harvestAt(g: Game, i: number, now: number): Game {
  const p = g.plots[i]
  if (!p || !isReady(p, now)) return g
  return {
    ...g,
    xp: g.xp + 10,
    inventory: { ...g.inventory, [p.type]: g.inventory[p.type] + 2 },
    harvested: { ...g.harvested, [p.type]: g.harvested[p.type] + 1 },
    plots: g.plots.map((q, j) => (j === i ? null : q)),
  }
}

function shiftGrowing(g: Game, now: number, fraction: (remaining: number) => number): Game {
  return {
    ...g,
    plots: g.plots.map((p) => {
      if (!p || isReady(p, now)) return p
      const remaining = p.growMs - (now - p.plantedAt)
      return { ...p, plantedAt: p.plantedAt - fraction(remaining) }
    }),
  }
}

export function water(g: Game, now: number): Game {
  if (now - g.wateredAt < WATER_COOLDOWN_MS) return g
  return { ...shiftGrowing(g, now, () => GROW_MS * 0.2), wateredAt: now }
}

export function speedUp(g: Game, now: number): Game {
  if (g.inventory.speed < 1) return g
  const next = shiftGrowing(g, now, (remaining) => remaining / 2)
  return { ...next, inventory: { ...g.inventory, speed: g.inventory.speed - 1 } }
}

export function instantGrow(g: Game, now: number): Game {
  if (g.inventory.instant < 1) return g
  const next = shiftGrowing(g, now, (remaining) => remaining)
  return { ...next, inventory: { ...g.inventory, instant: g.inventory.instant - 1 } }
}

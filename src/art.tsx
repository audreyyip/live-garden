// Simple SVG drawings. Swap any of these for your exported Figma art later.
import { Timer, WandSparkles } from 'lucide-react'
import { CROPS, type CropType, type ItemKey } from '@/game'

export function CarrotArt({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 200" height={size} width={size * 0.6} aria-hidden="true">
      <ellipse cx="38" cy="52" rx="13" ry="28" fill="#5c8a3a" transform="rotate(-35 38 52)" />
      <ellipse cx="82" cy="52" rx="13" ry="28" fill="#5c8a3a" transform="rotate(35 82 52)" />
      <ellipse cx="60" cy="36" rx="16" ry="34" fill="#78a04e" />
      <path d="M18 72 Q60 42 102 72 Q96 142 60 198 Q24 142 18 72Z" fill="#fb923c" />
      <path d="M78 58 Q102 66 102 72 Q96 142 60 198 Q86 130 78 58Z" fill="#f47c20" />
      <path d="M34 92 q14 -6 26 0 q-12 8 -26 0Z M44 128 q10 -5 20 0 q-10 6 -20 0Z" fill="#f47c20" />
    </svg>
  )
}

export function CropArt({ type, size }: { type: CropType; size: number }) {
  if (type === 'carrot') return <CarrotArt size={size} />
  return (
    <span style={{ fontSize: size * 0.8, lineHeight: 1 }} aria-hidden="true">
      {CROPS[type].emoji}
    </span>
  )
}

export function ItemIcon({ item, size }: { item: ItemKey; size: number }) {
  if (item === 'speed') return <Timer size={size} aria-hidden="true" />
  if (item === 'instant') return <WandSparkles size={size} aria-hidden="true" />
  return (
    <span style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">
      {CROPS[item].emoji}
    </span>
  )
}

export function Person({ walking = false, can = false, size = 96 }: { walking?: boolean; can?: boolean; size?: number }) {
  const skin = '#fde0c8'
  return (
    <svg viewBox="0 0 70 120" height={size} width={size * (70 / 120)} aria-hidden="true">
      {walking ? (
        <>
          <path d="M14 76H28L19 112H6Z" fill="#9e9e9e" />
          <path d="M32 76H46L54 112H41Z" fill="#9e9e9e" />
          <ellipse cx="11" cy="114" rx="8" ry="4" fill="#5b3a8c" />
          <ellipse cx="49" cy="114" rx="8" ry="4" fill="#5b3a8c" />
        </>
      ) : (
        <>
          <rect x="14" y="76" width="14" height="34" rx="3" fill="#9e9e9e" />
          <rect x="32" y="76" width="14" height="34" rx="3" fill="#9e9e9e" />
          <ellipse cx="21" cy="112" rx="9" ry="4" fill="#5b3a8c" />
          <ellipse cx="39" cy="112" rx="9" ry="4" fill="#5b3a8c" />
        </>
      )}
      <rect x="3" y="42" width="9" height="32" rx="4.5" fill={skin} transform={walking ? 'rotate(16 8 44)' : undefined} />
      <rect x="48" y="42" width="9" height="32" rx="4.5" fill={skin} transform={walking ? 'rotate(-16 52 44)' : undefined} />
      <path d="M12 42 Q30 32 48 42 L50 80 H10Z" fill="#9b6bc7" />
      <ellipse cx="30" cy="16" rx="16" ry="15" fill="#1c1917" />
      <ellipse cx="30" cy="20" rx="11" ry="12" fill={skin} />
      <circle cx="26" cy="19" r="1.4" fill="#1c1917" />
      <circle cx="34" cy="19" r="1.4" fill="#1c1917" />
      <path d="M25 25 Q30 29 35 25" stroke="#c2410c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {can && (
        <g>
          <path d="M44 70 L62 60" stroke="#8c969c" strokeWidth="4" strokeLinecap="round" />
          <rect x="40" y="66" width="22" height="16" rx="3" fill="#8c969c" />
        </g>
      )}
    </svg>
  )
}

// Map pin: a sprout on a signpost.
export function SignSprout({ size = 48, dim = false }: { size?: number; dim?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="#4a3c35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={dim ? 0.35 : 1} aria-hidden="true">
      <path d="M12 56H52" />
      <path d="M40 56V12" />
      <rect x="32" y="6" width="16" height="12" rx="5" />
      <path d="M22 56V40" />
      <path d="M22 44C12 44 10 36 10 32C18 32 22 36 22 44Z" />
      <path d="M22 40C22 32 28 30 34 30C34 38 28 40 22 40Z" />
    </svg>
  )
}

function starPoints(n: number, outer: number, inner: number, cx: number, cy: number) {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI * i) / n - Math.PI / 2
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const BURST = starPoints(14, 330, 190, 200, 200)

export function Burst() {
  return (
    <svg viewBox="-130 -130 660 660" className="absolute left-1/2 top-1/2 w-[165%] max-w-none -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
      <polygon points={BURST} fill="#f0d36a" opacity="0.9" />
    </svg>
  )
}

// Garden backdrop: house, tree and tulips in a blue-grey silhouette.
export function GardenScene() {
  const c = '#6b8a97'
  return (
    <svg viewBox="0 0 402 340" className="w-full" aria-hidden="true">
      <rect x="170" y="20" width="26" height="60" fill={c} />
      <path d="M30 160 L190 60 L350 160Z" fill={c} />
      <rect x="60" y="150" width="270" height="190" fill={c} />
      <rect x="40" y="215" width="320" height="14" fill={c} />
      <rect x="170" y="100" width="40" height="46" rx="4" fill="#9fdcf5" />
      <rect x="110" y="170" width="44" height="46" rx="4" fill="#9fdcf5" />
      <rect x="170" y="250" width="44" height="60" rx="4" fill="#9fdcf5" />
      <rect x="250" y="250" width="36" height="60" rx="4" fill="#9fdcf5" />
      <path d="M272 40 C250 20 286 -10 316 20 C350 50 350 110 328 150 C346 190 330 215 312 230 V320 H290 V230 C262 220 254 190 272 150 C250 110 252 70 272 40Z" fill={c} />
      <g stroke="#e8f6fb" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M300 300 V270 M296 270 L300 258 L304 270Z" />
        <path d="M318 300 V274 M314 274 L318 262 L322 274Z" />
        <path d="M336 300 V268 M332 268 L336 256 L340 268Z" />
        <path d="M354 300 V274 M350 274 L354 262 L358 274Z" />
      </g>
    </svg>
  )
}

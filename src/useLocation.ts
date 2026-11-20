import { useCallback, useEffect, useRef, useState } from 'react'
import { distanceM, type Pos } from '@/game'

// Real GPS by default. Practice mode lets you tap the map to move (handy indoors).
export function useLocation(practice: boolean, onMove: (p: Pos) => void) {
  const [pos, setPos] = useState<Pos | null>(null)
  const [error, setError] = useState('')
  const [walking, setWalking] = useState(false)
  const [tries, setTries] = useState(0)
  const lastPos = useRef<Pos | null>(null)
  const timer = useRef(0)
  const unsupported = !('geolocation' in navigator)

  const move = useCallback(
    (p: Pos) => {
      const prev = lastPos.current
      lastPos.current = p
      setPos(p)
      onMove(p)
      if (prev && distanceM(prev, p) > 1.5) {
        setWalking(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setWalking(false), 4000)
      }
    },
    [onMove],
  )

  useEffect(() => {
    if (practice || unsupported) return
    const id = navigator.geolocation.watchPosition(
      (g) => {
        setError('')
        move({ lat: g.coords.latitude, lng: g.coords.longitude })
      },
      (e) =>
        setError(
          e.code === 1
            ? 'Location is blocked. Allow location for this site in your browser settings, then try again.'
            : 'Cannot find you yet. Check your signal or step outside.',
        ),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 },
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [practice, unsupported, tries, move])

  return {
    pos,
    walking,
    move,
    error: unsupported ? 'This browser cannot share your location.' : error,
    retry: () => setTries((t) => t + 1),
  }
}

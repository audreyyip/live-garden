import { useEffect, useRef, useState } from "react"
import { SHAKES_NEEDED } from "@/data"
import { Button } from "@/components/ui/button"

// ios makes you ask permission, android does not
const needsAsk = typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function"

export default function Shake({ onDone }) {
  const [count, setCount] = useState(0)
  const [asked, setAsked] = useState(!needsAsk)
  const lastShake = useRef(0)
  const done = count >= SHAKES_NEEDED

  const shake = () => setCount((n) => n + 1)

  async function askPermission() {
    const answer = await DeviceMotionEvent.requestPermission()
    if (answer === "granted") setAsked(true)
  }

  useEffect(() => {
    if (!asked) return
    function onMotion(e) {
      const a = e.accelerationIncludingGravity
      if (!a) return
      const force = Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z)
      const now = Date.now()
      if (force > 30 && now - lastShake.current > 300) {
        lastShake.current = now
        shake()
      }
    }
    window.addEventListener("devicemotion", onMotion)
    return () => window.removeEventListener("devicemotion", onMotion)
  }, [asked])

  useEffect(() => {
    if (!done) return
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [done])

  if (done) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center bg-gradient-to-b from-white to-sky">
        <div className="absolute inset-x-0 top-[12%] mx-auto size-[420px] rounded-full bg-yellow-200" />
        <p className="relative -rotate-12 text-6xl font-semibold">You've got a</p>
        <div className="pop relative my-4 text-[170px]">🥕</div>
        <p className="relative -rotate-6 text-7xl font-semibold">Carrot!</p>
      </div>
    )
  }

  return (
    <div className="sky relative h-full">
      <p className="pt-12 text-center text-lg">{count === 0 ? "shake your phone to get the carrot!" : "keep going! almost there!"}</p>

      <div className="absolute inset-x-0 bottom-[20%] flex justify-center">
        {/* key changes each shake so the wiggle restarts. carrot rises a bit every shake */}
        <div key={count} className={count > 0 ? "wiggle" : ""} style={{ translate: `0 ${-count * 10}px`, fontSize: 150 }}>
          🥕
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[20%] bg-soil" />

      <div className="absolute inset-x-0 bottom-[6%] flex flex-col items-center gap-3">
        {!asked && <Button onClick={askPermission}>Turn on shaking</Button>}
        <Button variant="soft" onClick={shake}>Shake!</Button>
      </div>
    </div>
  )
}

import { useEffect, useRef } from "react"

const COLS = 10
const ROWS = 20
const NEEDED = 0.4 // fraction of grid cells scratched before we finish

export default function Reveal({ landmark, onDone }) {
  const canvas = useRef()
  const cells = useRef(new Set())
  const down = useRef(false)

  useEffect(() => {
    const c = canvas.current
    c.width = c.offsetWidth
    c.height = c.offsetHeight
    const ctx = c.getContext("2d")
    ctx.fillStyle = "#b3ecff"
    ctx.fillRect(0, 0, c.width, c.height)
  }, [])

  function scratch(e) {
    if (!down.current) return
    const c = canvas.current
    const r = c.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const ctx = c.getContext("2d")
    ctx.globalCompositeOperation = "destination-out"
    ctx.filter = "blur(6px)"
    ctx.beginPath()
    ctx.arc(x, y, 38, 0, Math.PI * 2)
    ctx.fill()

    cells.current.add(Math.floor((x / r.width) * COLS) + "," + Math.floor((y / r.height) * ROWS))
    if (cells.current.size / (COLS * ROWS) > NEEDED) onDone()
  }

  return (
    <div className="relative h-full">
      {/* photo goes in public/landmarks. emoji shows if photo is missing */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-cover bg-center text-[160px]"
        style={{ backgroundImage: `url(./landmarks/${landmark.photo})`, backgroundColor: "#ffe9a8" }}
      >
        {landmark.emoji}
      </div>
      <canvas
        ref={canvas}
        className="absolute inset-0 size-full touch-none"
        onPointerDown={(e) => ((down.current = true), scratch(e))}
        onPointerMove={scratch}
        onPointerUp={() => (down.current = false)}
      />
      <p className="pointer-events-none absolute inset-x-0 top-12 text-center text-lg">Swipe to uncover the landmark!</p>
    </div>
  )
}

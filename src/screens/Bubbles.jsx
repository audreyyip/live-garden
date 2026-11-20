import { ITEMS } from "@/data"
import { cn } from "@/lib/utils"

// where each bubble floats (percent of screen) and how big
const SPOTS = {
  carrot: "left-[4%] top-[42%] size-36",
  corn: "left-[40%] top-[53%] size-28",
  tomato: "left-[63%] top-[42%] size-20",
  speed: "left-[71%] top-[55%] size-20",
  instant: "left-[24%] top-[66%] size-16",
}

export default function Bubbles({ landmark, visit, onCarrot, onCollect, onGarden }) {
  return (
    <div className="relative h-full bg-cover bg-center" style={{ backgroundImage: `url(./landmarks/${landmark.photo})`, backgroundColor: "#ffe9a8" }}>
      <div className="absolute inset-0 flex items-center justify-center text-[200px] opacity-40">{landmark.emoji}</div>
      <p className="relative bg-gradient-to-b from-sky to-transparent px-4 pb-6 pt-12 text-center text-lg">
        You've arrived at {landmark.name}!
      </p>

      <button onClick={onGarden} className="absolute left-1/2 top-[16%] size-40 -translate-x-1/2 rounded-full bg-amber-200 text-7xl">
        🌱
      </button>

      {Object.entries(ITEMS).map(([id, item]) =>
        visit.includes(id) ? null : (
          <button
            key={id}
            onClick={() => (id === "carrot" ? onCarrot() : onCollect(id))}
            className={cn("absolute rounded-full bg-sky/70 text-5xl backdrop-blur-sm active:scale-90 transition", SPOTS[id])}
          >
            {item.emoji}
          </button>
        )
      )}
    </div>
  )
}

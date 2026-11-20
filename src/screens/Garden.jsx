import { useState } from "react"
import { LILY_GOAL } from "@/data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Check = ({ on }) => (
  <span className="flex size-10 items-center justify-center rounded-full bg-white text-xl">{on ? "✓" : ""}</span>
)

export default function Garden({ carrots }) {
  const [watered, setWatered] = useState(false)
  const planted = Math.min(carrots, 4) // only 4 plots fit on screen

  return (
    <div className="sky relative h-full">
      <h1 className="pt-12 text-center text-xl">Garden Tasks</h1>
      <Card className="mx-4 mt-4 space-y-3 !rounded-[28px] p-5">
        <div className="flex items-center justify-between">
          <span>Grow {LILY_GOAL} carrots for your neighbor Lily ({carrots}/{LILY_GOAL})</span>
          <Check on={carrots >= LILY_GOAL} />
        </div>
        <div className="flex items-center justify-between">
          <span>Water your carrots</span>
          <Check on={watered} />
        </div>
      </Card>

      <div className="absolute inset-x-0 bottom-[14%] flex items-end justify-center text-[110px]">🏠</div>
      <div className="absolute inset-x-0 bottom-[12%] flex justify-center text-8xl">{watered ? "🚿" : "👩"}</div>

      <div className="absolute inset-x-0 bottom-[10%] h-[14%] bg-soil" />
      <div className="absolute inset-x-0 bottom-[14%] flex justify-around px-6 text-6xl">
        {planted === 0 ? <span className="text-base text-white">no carrots yet. go find some!</span> : Array.from({ length: planted }, (_, i) => <span key={i}>🥕</span>)}
      </div>

      <Button variant="soft" size="icon" className="absolute right-5 top-[34%]" onClick={() => setWatered(true)}>🚿</Button>
    </div>
  )
}

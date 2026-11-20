import { ITEMS } from "@/data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Reward({ visit, onOk }) {
  return (
    <div className="sky flex h-full flex-col items-center justify-center gap-6 px-5">
      <h1 className="text-3xl font-medium">Reward Summary</h1>
      <Card className="w-full space-y-3">
        {visit.map((id) => (
          <div key={id} className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-sky text-xl">{ITEMS[id].emoji}</span>
            <span className="flex-1">{ITEMS[id].label} x 1</span>
            <span>+{ITEMS[id].xp} XP</span>
          </div>
        ))}
      </Card>
      <Button onClick={onOk}>Okay!</Button>
    </div>
  )
}

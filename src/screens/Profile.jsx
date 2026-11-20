import { ITEMS } from "@/data"
import { Card } from "@/components/ui/card"

export default function Profile({ title, text, inv = {} }) {
  return (
    <div className="sky flex h-full flex-col items-center gap-4 px-5 pt-20">
      <h1 className="text-3xl font-medium">{title}</h1>
      <p className="text-xl">{text}</p>
      {Object.keys(inv).length > 0 && (
        <Card className="w-full space-y-2">
          {Object.entries(inv).map(([id, n]) => (
            <div key={id}>{ITEMS[id].emoji} {ITEMS[id].label} x {n}</div>
          ))}
        </Card>
      )}
    </div>
  )
}

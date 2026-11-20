import { Map, Sprout, House, User } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [["map", Map], ["garden", Sprout], ["home", House], ["profile", User]]

export default function Nav({ screen, onGo }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-[1000] flex justify-around rounded-t-[48px] bg-white px-4 pb-8 pt-5">
      {TABS.map(([id, Icon]) => (
        <button key={id} onClick={() => onGo(id)} className={cn("p-2", screen === id ? "text-soil" : "text-soil/40")}>
          <Icon size={36} strokeWidth={1.5} />
        </button>
      ))}
    </nav>
  )
}

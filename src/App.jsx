import { useState } from "react"
import { ITEMS } from "@/data"
import Nav from "@/screens/Nav"
import MapScreen from "@/screens/MapScreen"
import Reveal from "@/screens/Reveal"
import Bubbles from "@/screens/Bubbles"
import Shake from "@/screens/Shake"
import Reward from "@/screens/Reward"
import Garden from "@/screens/Garden"
import Profile from "@/screens/Profile"

const TABS = ["map", "garden", "home", "profile"]

export default function App() {
  const [screen, setScreen] = useState("map")
  const [landmark, setLandmark] = useState(null)
  const [visit, setVisit] = useState([]) // bubbles popped at this landmark
  const [inv, setInv] = useState({}) // item id -> count. gone on reload, on purpose
  const [xp, setXp] = useState(0)

  function arrive(l) {
    setLandmark(l)
    setVisit([])
    setScreen("reveal")
  }

  function collect(id) {
    const next = [...visit, id]
    setVisit(next)
    setScreen("bubbles")
    if (next.length === Object.keys(ITEMS).length) setScreen("reward")
  }

  function finishReward() {
    const nextInv = { ...inv }
    let gained = 0
    visit.forEach((id) => {
      nextInv[id] = (nextInv[id] || 0) + 1
      gained += ITEMS[id].xp
    })
    setInv(nextInv)
    setXp(xp + gained)
    setScreen("map")
  }

  return (
    <div className="relative mx-auto h-full max-w-md overflow-hidden bg-sky">
      {/* map stays mounted so the avatar keeps its spot */}
      <div className={screen === "map" ? "h-full" : "hidden"}>
        <MapScreen onArrive={arrive} paused={screen !== "map"} />
      </div>

      {screen === "reveal" && <Reveal landmark={landmark} onDone={() => setScreen("bubbles")} />}
      {screen === "bubbles" && (
        <Bubbles
          landmark={landmark}
          visit={visit}
          onCarrot={() => setScreen("shake")}
          onCollect={collect}
          onGarden={() => setScreen("garden")}
        />
      )}
      {screen === "shake" && <Shake onDone={() => collect("carrot")} />}
      {screen === "reward" && <Reward visit={visit} onOk={finishReward} />}
      {screen === "garden" && <Garden carrots={inv.carrot || 0} />}
      {screen === "home" && <Profile title="Neighbors" text="Lily's house is coming soon." />}
      {screen === "profile" && <Profile title="You" text={`${xp} XP`} inv={inv} />}

      {TABS.includes(screen) && <Nav screen={screen} onGo={setScreen} />}
    </div>
  )
}

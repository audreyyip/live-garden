// all the tuning knobs live here

export const START = [40.7285, -73.9955] // west of astor place

export const LANDMARKS = [
  { id: "cube", name: "Alamo / Astor Place Cube", emoji: "🧊", lat: 40.72955, lng: -73.99163, photo: "cube.jpg" },
  { id: "park", name: "Washington Square Park", emoji: "⛲", lat: 40.7308, lng: -73.9973, photo: "park.jpg" },
  { id: "union", name: "Union Square", emoji: "🌳", lat: 40.7359, lng: -73.9911, photo: "union.jpg" },
  { id: "ice", name: "Museum of Ice Cream", emoji: "🍦", lat: 40.7243, lng: -73.9996, photo: "ice.jpg" },
]

// what you get from each bubble
export const ITEMS = {
  carrot: { emoji: "🥕", label: "Carrots", xp: 25 },
  tomato: { emoji: "🍅", label: "Tomato", xp: 25 },
  corn: { emoji: "🌽", label: "Corn", xp: 25 },
  speed: { emoji: "⏱️", label: "Increase Grow Speed", xp: 50 },
  instant: { emoji: "✨", label: "Instant Grow", xp: 100 },
}

export const SHAKES_NEEDED = 6
export const LILY_GOAL = 10 // carrots to grow for neighbor Lily

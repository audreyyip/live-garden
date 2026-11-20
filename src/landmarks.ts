// Landmarks you can visit for bonus rewards.
// To add a photo, put a jpg in public/landmarks/ and set `photo` to its file name.
export type Landmark = { id: string; name: string; lat: number; lng: number; photo?: string }

export const LANDMARKS: Landmark[] = [
  { id: 'astor-cube', name: 'Alamo / Astor Place Cube', lat: 40.72995, lng: -73.99172, photo: 'astor-cube.jpg' },
  { id: 'union-square', name: 'Union Square', lat: 40.7359, lng: -73.9911 },
  { id: 'strand', name: 'Strand Bookstore', lat: 40.7332, lng: -73.9908 },
  { id: 'washington-square', name: 'Washington Square Park', lat: 40.7308, lng: -73.9973 },
  { id: 'ice-cream', name: 'Museum of Ice Cream', lat: 40.7246, lng: -73.9976 },
]

export const START = { lat: 40.7295, lng: -73.9915 } // map centre before GPS answers

export function photoUrl(l: Landmark) {
  return l.photo ? `${import.meta.env.BASE_URL}landmarks/${l.photo}` : ''
}

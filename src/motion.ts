// Shake detection needs permission on iPhones (tap required). Android and desktop just work.
type MotionEvent = typeof DeviceMotionEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

let granted = false

export function needsMotionPermission() {
  if (typeof DeviceMotionEvent === 'undefined' || granted) return false
  return typeof (DeviceMotionEvent as MotionEvent).requestPermission === 'function'
}

export async function askMotionPermission() {
  try {
    const answer = await (DeviceMotionEvent as MotionEvent).requestPermission?.()
    granted = answer === 'granted'
  } catch {
    granted = false
  }
  return granted
}

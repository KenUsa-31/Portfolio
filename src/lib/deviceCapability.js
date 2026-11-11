let cached = null

export function isLowPowerDevice() {
  if (cached !== null) return cached
  if (typeof window === 'undefined') {
    cached = false
    return cached
  }

  const nav = navigator
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4
  const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  cached = lowMemory || lowCores || reducedMotion
  return cached
}
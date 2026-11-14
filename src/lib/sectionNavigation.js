export const SECTION_IDS = [
  'home',
  'about',
  'skills',
  'experience',
  'projects',
  'certificates',
  'contact',
]

export function navigateToSection(id) {
  if (!SECTION_IDS.includes(id)) return false

  if (window.location.hash !== `#${id}`) {
    window.history.pushState(null, '', `#${id}`)
  }

  window.dispatchEvent(new CustomEvent('portfolio:navigate-section', { detail: id }))
  return true
}

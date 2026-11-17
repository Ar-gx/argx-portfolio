export function isMotionReduced() {
  return typeof document !== 'undefined' && document.documentElement.dataset.motion === 'reduced';
}

export function useMotionPreference() {
  return isMotionReduced();
}

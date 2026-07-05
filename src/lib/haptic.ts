/**
 * Simulates native Android physical haptic feedback by triggering
 * a brief vibration pulse. Safe to call on any platform (server or client).
 */
export function triggerHaptic(duration = 15) {
  if (
    typeof window !== 'undefined' &&
    typeof window.navigator !== 'undefined' &&
    typeof window.navigator.vibrate === 'function'
  ) {
    try {
      window.navigator.vibrate(duration);
    } catch (e) {
      // Ignore vibration failures (e.g. security exceptions in iframe)
      console.warn('Haptic feedback failed:', e);
    }
  }
}

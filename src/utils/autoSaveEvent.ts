/**
 * Global Auto-Save Notification Dispatcher
 * Dispatches a lightweight browser event when scratchpads, notes, or flashcards sync to localStorage.
 */

let lastDispatched = 0;
const THROTTLE_MS = 1200;

export function triggerAutoSaveToast(label: string = 'Content') {
  const now = Date.now();
  if (now - lastDispatched < THROTTLE_MS) {
    return;
  }
  lastDispatched = now;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kaybit-autosave', {
        detail: { label, timestamp: now }
      })
    );
  }
}

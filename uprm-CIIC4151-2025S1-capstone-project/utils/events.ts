// utils/events.ts
type Listener = () => void;

const listeners = new Set<Listener>();

export const PIN_CHANGED = "pin-changed"; // keep the name if you reference it anywhere

export function emitPinChanged() {
  // call all listeners
  for (const fn of Array.from(listeners)) {
    try { fn(); } catch (e) { /* no-op */ }
  }
}

export function onPinChanged(handler: Listener) {
  listeners.add(handler);
  // return unsubscribe
  return () => listeners.delete(handler);
}

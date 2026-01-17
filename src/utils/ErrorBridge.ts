// src/lib/errorBridge.ts
let triggerError: ((msg: string) => void) | null = null;

export function registerErrorHandler(fn: (msg: string) => void) {
  triggerError = fn;
}

export function showGlobalError(msg: string) {
  if (triggerError) triggerError(msg);
}

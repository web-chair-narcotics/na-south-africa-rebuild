type RuntimeErrorPayload = {
  message: string;
  stack?: string;
  path: string;
  userAgent: string;
  timestamp: string;
};

export function reportRuntimeError(error: unknown) {
  const value = error instanceof Error ? error : new Error(String(error));
  const payload: RuntimeErrorPayload = {
    message: value.message,
    stack: value.stack,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };
  console.error("[NA runtime error]", payload);
  try {
    navigator.sendBeacon?.("/api/runtime-errors", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  } catch {
    // Reporting must never create a second user-visible failure.
  }
}

window.addEventListener("error", event => reportRuntimeError(event.error ?? event.message));
window.addEventListener("unhandledrejection", event => reportRuntimeError(event.reason));

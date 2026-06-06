import { RuntimeResponse, RuntimeState } from "../types";

function getState(runtime: RuntimeResponse | RuntimeState | null | undefined): RuntimeState | null {
  if (!runtime) return null;
  if (typeof runtime === "string") return runtime;
  return runtime.state || null;
}

/**
 * Checks if the application runtime status is OPERATIONAL.
 */
export function isOperational(runtime: RuntimeResponse | RuntimeState | null | undefined): boolean {
  return getState(runtime) === "OPERATIONAL";
}

/**
 * Checks if the application runtime status is MAINTENANCE.
 */
export function isMaintenance(runtime: RuntimeResponse | RuntimeState | null | undefined): boolean {
  return getState(runtime) === "MAINTENANCE";
}

/**
 * Checks if the application runtime status is DEGRADED.
 */
export function isDegraded(runtime: RuntimeResponse | RuntimeState | null | undefined): boolean {
  return getState(runtime) === "DEGRADED";
}

/**
 * Checks if the application runtime status is OUTAGE.
 */
export function isOutage(runtime: RuntimeResponse | RuntimeState | null | undefined): boolean {
  return getState(runtime) === "OUTAGE";
}

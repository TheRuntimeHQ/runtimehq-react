import { RuntimeResponse, RuntimeState, CapabilityState } from "../types";

type StateInput = RuntimeResponse | CapabilityState | RuntimeState | null | undefined;

function getState(input: StateInput): RuntimeState | null {
  if (!input) return null;
  if (typeof input === "string") return input;
  return input.state || null;
}

/**
 * Checks if the application runtime status is OPERATIONAL.
 */
export function isOperational(input: StateInput): boolean {
  return getState(input) === "OPERATIONAL";
}

/**
 * Checks if the application runtime status is MAINTENANCE.
 */
export function isMaintenance(input: StateInput): boolean {
  return getState(input) === "MAINTENANCE";
}

/**
 * Checks if the application runtime status is DEGRADED.
 */
export function isDegraded(input: StateInput): boolean {
  return getState(input) === "DEGRADED";
}

/**
 * Checks if the application runtime status is OUTAGE.
 */
export function isOutage(input: StateInput): boolean {
  return getState(input) === "OUTAGE";
}

"use client";

import { useMemo } from "react";
import { useRuntimeHQ } from "./useRuntimeHQ";
import { UseCapabilityResult, RuntimeState } from "../types";

/**
 * Accesses and monitors the health state of a specific capability.
 * Must be used within a `<RuntimeHQProvider>`.
 *
 * Implements a fail-open pattern: if the capability is not present or
 * RuntimeHQ is loading/errored, the state defaults to "OPERATIONAL"
 * and isOperational is true.
 *
 * @param name The unique name of the capability to check (e.g. "search", "payments")
 */
export function useCapability(name: string): UseCapabilityResult {
  const { getCapabilityState, hasCapability, loading, error } = useRuntimeHQ();

  return useMemo(() => {
    const capability = getCapabilityState(name);
    const exists = hasCapability(name);
    const state: RuntimeState = capability?.state ?? "OPERATIONAL";
    const message = capability?.message ?? "";

    return {
      capability,
      state,
      message,
      isOperational: state === "OPERATIONAL",
      isDegraded: state === "DEGRADED",
      isOutage: state === "OUTAGE",
      isMaintenance: state === "MAINTENANCE",
      exists,
      loading,
      error,
    };
  }, [getCapabilityState, hasCapability, name, loading, error]);
}

"use client";

import { useContext } from "react";
import { RuntimeHQContext } from "../context";
import { RuntimeHQContextValue } from "../types";

/**
 * Accesses the global RuntimeHQ status check context.
 * Must be used within a `<RuntimeHQProvider>`.
 */
export function useRuntimeHQ(): RuntimeHQContextValue {
  const context = useContext(RuntimeHQContext);
  if (!context) {
    throw new Error("useRuntimeHQ must be used within a RuntimeHQProvider");
  }
  return context;
}

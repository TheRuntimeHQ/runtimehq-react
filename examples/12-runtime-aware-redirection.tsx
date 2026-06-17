/**
 * Business Outcome: Automatically redirect users when a capability becomes unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React, { useEffect } from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function AutomaticRedirector() {
  const { runtime } = useRuntimeHQ();

  useEffect(() => {
    if (runtime?.state === "OUTAGE") {
      window.location.href = "/system-down";
    }
  }, [runtime?.state]);

  return null; // Invisible observer component
}
/**
 * Business Outcome: Hide unavailable functionality from users.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function FeatureGate({ capabilityName, children }: { capabilityName: string, children: React.ReactNode }) {
  const { hasCapability, getCapabilityState } = useRuntimeHQ();

  if (hasCapability(capabilityName)) {
    const cap = getCapabilityState(capabilityName);
    if (cap && cap.state !== "OPERATIONAL") {
      return null; // Hide the feature completely
    }
  }

  return <>{children}</>;
}
/**
 * Business Outcome: Hide unavailable functionality from users.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

export function FeatureGate({ capabilityName, children }: { capabilityName: string, children: React.ReactNode }) {
  const { isOperational } = useCapability(capabilityName);

  if (!isOperational) {
    return null; // Hide the feature completely
  }

  return <>{children}</>;
}
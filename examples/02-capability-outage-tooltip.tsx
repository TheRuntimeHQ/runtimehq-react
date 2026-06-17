/**
 * Business Outcome: Explain why a specific feature is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function CapabilityOutageTooltip({ children, capabilityName }: { children: React.ReactNode, capabilityName: string }) {
  const { hasCapability, getCapabilityState } = useRuntimeHQ();

  if (hasCapability(capabilityName)) {
    const cap = getCapabilityState(capabilityName);
    if (cap && cap.state !== "OPERATIONAL") {
      return (
        <div className="tooltip-wrapper" title={cap.message}>
          <div className="disabled-element">{children}</div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
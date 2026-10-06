/**
 * Business Outcome: Explain why a specific feature is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

export function CapabilityOutageTooltip({ children, capabilityName }: { children: React.ReactNode, capabilityName: string }) {
  const { isOperational, message } = useCapability(capabilityName);

  if (!isOperational) {
    return (
      <div className="tooltip-wrapper" title={message}>
        <div className="disabled-element">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
}
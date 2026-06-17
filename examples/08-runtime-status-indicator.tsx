/**
 * Business Outcome: Show operational status in the application header, footer, or navigation.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function StatusIndicator() {
  const { runtime } = useRuntimeHQ();
  if (!runtime) return null;

  const colorMap: Record<string, string> = {
    OPERATIONAL: "green",
    DEGRADED: "yellow",
    MAINTENANCE: "blue",
    OUTAGE: "red",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: colorMap[runtime.state] }} />
      <span>System Status</span>
    </div>
  );
}
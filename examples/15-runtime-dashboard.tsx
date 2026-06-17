/**
 * Business Outcome: Build an operational dashboard displaying application health and capability health.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function OperationsDashboard() {
  const { runtime } = useRuntimeHQ();

  if (!runtime) return null;

  return (
    <div className="dashboard">
      <h2>App Health: {runtime.state}</h2>
      <p>Last checked: {runtime.lastSuccessfulFetchAt.toLocaleTimeString()}</p>
      <div className="capabilities-grid">
        {runtime.capabilityStates.map((cap) => (
          <div key={cap.capabilityName} className={`card ${cap.state.toLowerCase()}`}>
            <h3>{cap.capabilityName}</h3>
            <p>{cap.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
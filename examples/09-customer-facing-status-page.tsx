/**
 * Business Outcome: Build a public status page powered by RuntimeHQ.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function StatusPage() {
  const { runtime, loading } = useRuntimeHQ();

  if (loading) return <div>Loading status...</div>;
  if (!runtime) return <div>Unable to load status</div>;

  return (
    <div className="status-container">
      <h1>System Status: {runtime.state}</h1>
      <p>{runtime.message}</p>
      <ul className="capabilities-list">
        {runtime.capabilityStates.map((cap) => (
          <li key={cap.capabilityName}>
            <strong>{cap.capabilityName}:</strong> {cap.state}
          </li>
        ))}
      </ul>
    </div>
  );
}
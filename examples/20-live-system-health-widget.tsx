/**
 * Business Outcome: Embed a reusable health widget anywhere in the application.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function HealthWidget() {
  const { runtime, error } = useRuntimeHQ();

  if (error) {
    return <div className="widget error">Unable to check system health</div>;
  }

  if (!runtime) return null;

  return (
    <div className={`health-widget ${runtime.dataStatus === 'STALE' ? 'stale' : 'live'}`}>
      <strong>{runtime.state}</strong>
      <span>Data is {runtime.dataStatus}</span>
    </div>
  );
}
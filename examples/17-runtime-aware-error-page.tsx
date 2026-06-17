/**
 * Business Outcome: Replace generic errors with operationally-aware messaging.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function GlobalErrorFallback({ error }: { error: Error }) {
  const { runtime } = useRuntimeHQ();

  if (runtime?.state === "OUTAGE") {
    return (
      <div className="known-outage-screen">
        <h1>We're experiencing an outage</h1>
        <p>Our engineers are working on it. {runtime.message}</p>
      </div>
    );
  }

  return (
    <div className="generic-error-screen">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
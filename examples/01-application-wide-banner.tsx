/**
 * Business Outcome: Inform all users when the application is degraded, under maintenance, or unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function ApplicationWideBanner() {
  const { runtime, loading } = useRuntimeHQ();

  if (loading || !runtime || runtime.state === "OPERATIONAL") {
    return null;
  }

  return (
    <div className={`banner banner-${runtime.state.toLowerCase()}`}>
      <p>⚠️ {runtime.message}</p>
    </div>
  );
}
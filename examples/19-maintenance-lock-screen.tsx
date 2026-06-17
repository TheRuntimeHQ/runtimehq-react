/**
 * Business Outcome: Restrict access to workflows during active maintenance windows.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function MaintenanceLockScreen({ children }: { children: React.ReactNode }) {
  const { runtime } = useRuntimeHQ();

  if (runtime?.state === "MAINTENANCE") {
    return (
      <div className="lock-screen">
        <h2>Scheduled Maintenance</h2>
        <p>{runtime.message}</p>
        <p>Please check back later.</p>
      </div>
    );
  }

  return <>{children}</>;
}
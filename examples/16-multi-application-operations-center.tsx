/**
 * Business Outcome: Monitor multiple applications from a unified screen.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQState } from "@theruntimehq/react";

export function MultiAppDashboard() {
  const app1 = useRuntimeHQState({ runtimeKey: "rt_prod_app1" });
  const app2 = useRuntimeHQState({ runtimeKey: "rt_prod_app2" });

  return (
    <div className="multi-app-grid">
      <div className="app-card">
        <h3>Frontend App</h3>
        <p>Status: {app1.loading ? "Loading..." : app1.runtime?.state}</p>
      </div>
      <div className="app-card">
        <h3>Backend API</h3>
        <p>Status: {app2.loading ? "Loading..." : app2.runtime?.state}</p>
      </div>
    </div>
  );
}
/**
 * Business Outcome: Keep the application usable while blocking write operations.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function SettingsForm() {
  const { runtime } = useRuntimeHQ();
  const isReadOnly = runtime && (runtime.state === "OUTAGE" || runtime.state === "MAINTENANCE");

  return (
    <form>
      {isReadOnly && <p>System is in read-only mode. Changes cannot be saved at this time.</p>}
      <input type="text" defaultValue="User Name" disabled={isReadOnly} />
      <button type="submit" disabled={isReadOnly}>Save Changes</button>
    </form>
  );
}
/**
 * Business Outcome: Prevent uploads while the upload capability is under maintenance.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function DocumentUploader() {
  const { hasCapability, getCapabilityState } = useRuntimeHQ();
  const uploads = getCapabilityState("uploads");
  const isMaintenance = hasCapability("uploads") && uploads?.state === "MAINTENANCE";

  if (isMaintenance) {
    return <div className="maintenance-notice">Uploads are currently under maintenance: {uploads?.message}</div>;
  }

  return <input type="file" />;
}
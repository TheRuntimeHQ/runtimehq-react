/**
 * Business Outcome: Prevent uploads while the upload capability is under maintenance.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

export function DocumentUploader() {
  const { isMaintenance, message } = useCapability("uploads");

  if (isMaintenance) {
    return <div className="maintenance-notice">Uploads are currently under maintenance: {message}</div>;
  }

  return <input type="file" />;
}
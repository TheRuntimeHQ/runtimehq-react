/**
 * Business Outcome: Prevent access to routes backed by unavailable capabilities.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React, { useEffect } from "react";
import { useRuntimeHQ } from "@theruntimehq/react";
// Assuming react-router-dom or similar
// import { useNavigate } from "react-router-dom";

export function ProtectedRoute({ capability, children }: { capability: string, children: React.ReactNode }) {
  const { hasCapability, getCapabilityState, loading } = useRuntimeHQ();
  // const navigate = useNavigate();

  useEffect(() => {
    if (!loading && hasCapability(capability)) {
      const cap = getCapabilityState(capability);
      if (cap?.state === "OUTAGE") {
        // navigate("/unavailable");
        console.log("Redirect to unavailable page");
      }
    }
  }, [loading, capability, hasCapability, getCapabilityState]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
/**
 * Business Outcome: Prevent access to routes backed by unavailable capabilities.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React, { useEffect } from "react";
import { useCapability } from "@theruntimehq/react";
// Assuming react-router-dom or similar
// import { useNavigate } from "react-router-dom";

export function ProtectedRoute({ capability, children }: { capability: string, children: React.ReactNode }) {
  const { isOutage, loading } = useCapability(capability);
  // const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isOutage) {
      // navigate("/unavailable");
      console.log("Redirect to unavailable page");
    }
  }, [loading, isOutage]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
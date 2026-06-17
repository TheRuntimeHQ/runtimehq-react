/**
 * Business Outcome: Communicate reduced functionality without blocking users.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function SearchBar() {
  const { getCapabilityState } = useRuntimeHQ();
  const search = getCapabilityState("search");

  return (
    <div>
      <input type="search" placeholder="Search..." />
      {search?.state === "DEGRADED" && (
        <small className="warning-text">Search might be slower than usual: {search.message}</small>
      )}
    </div>
  );
}
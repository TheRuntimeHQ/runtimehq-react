/**
 * Business Outcome: Communicate reduced functionality without blocking users.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

export function SearchBar() {
  const { isDegraded, message } = useCapability("search");

  return (
    <div>
      <input type="search" placeholder="Search..." />
      {isDegraded && (
        <small className="warning-text">Search might be slower than usual: {message}</small>
      )}
    </div>
  );
}
/**
 * Business Outcome: Adapt client input debounce delay to shed backend load during degraded states.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

// Generic debounce utility for demonstration
function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  let timer: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

export function AdaptiveSearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const { isOutage, isDegraded, message } = useCapability("search");

  // Dynamically back off request frequency when search capability is degraded
  const debounceDelayMs = isDegraded ? 1200 : 300;

  return (
    <div className="search-container">
      <input
        type="search"
        placeholder="Search products..."
        disabled={isOutage}
        onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value), debounceDelayMs)}
      />
      {(isOutage || isDegraded) && message && (
        <p className={`status-message ${isOutage ? "outage" : "degraded"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

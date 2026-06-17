/**
 * Business Outcome: Complete production integration including provider setup, refresh handling, and resilience patterns.
 */
import React from "react";
import { RuntimeHQProvider, useRuntimeHQ } from "@theruntimehq/react";

function AppContent() {
  const { error, runtime } = useRuntimeHQ();

  if (error && !runtime) {
    // Failed to load initial state and no cache available
    return <div>Failed to initialize application safety checks. Please refresh.</div>;
  }

  return (
    <main>
      <h1>My Application</h1>
      <p>App Status: {runtime?.state || "Initializing..."}</p>
    </main>
  );
}

export function App() {
  return (
    <RuntimeHQProvider runtimeKey="rt_prod_your_key" intervalSeconds={30}>
      <AppContent />
    </RuntimeHQProvider>
  );
}
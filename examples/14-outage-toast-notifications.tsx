/**
 * Business Outcome: Notify users immediately when runtime state changes occur.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React, { useEffect, useRef } from "react";
import { useRuntimeHQ } from "@theruntimehq/react";
// import { toast } from "react-hot-toast";

export function RuntimeStateNotifier() {
  const { runtime } = useRuntimeHQ();
  const previousState = useRef<string | null>(null);

  useEffect(() => {
    if (runtime && previousState.current && runtime.state !== previousState.current) {
      if (runtime.state === "OUTAGE") {
        console.log(`Toast Warning: ${runtime.message}`); // toast.error(runtime.message);
      } else if (runtime.state === "OPERATIONAL") {
        console.log("Toast Success: All systems operational!"); // toast.success("All systems operational!");
      }
    }
    if (runtime) {
      previousState.current = runtime.state;
    }
  }, [runtime]);

  return null;
}
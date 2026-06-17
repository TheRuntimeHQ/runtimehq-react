/**
 * Business Outcome: Redirect users to an alternative workflow when the primary capability is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function VideoPlayerPage() {
  const { getCapabilityState } = useRuntimeHQ();
  const highDefStreaming = getCapabilityState("hd-streaming");

  if (highDefStreaming?.state === "OUTAGE") {
    return (
      <div>
        <p>HD Streaming is currently unavailable. Falling back to Standard Definition.</p>
        <StandardDefPlayer />
      </div>
    );
  }

  return <HighDefPlayer />;
}

function HighDefPlayer() { return <div>HD Player</div>; }
function StandardDefPlayer() { return <div>SD Player</div>; }
/**
 * Business Outcome: Redirect users to an alternative workflow when the primary capability is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

export function VideoPlayerPage() {
  const { isOutage } = useCapability("hd-streaming");

  if (isOutage) {
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
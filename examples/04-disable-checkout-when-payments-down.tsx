/**
 * Business Outcome: Prevent purchases when the payments capability is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function CheckoutButton() {
  const { hasCapability, getCapabilityState } = useRuntimeHQ();
  const payments = getCapabilityState("payments");
  const isDown = hasCapability("payments") && payments?.state !== "OPERATIONAL";

  return (
    <button disabled={isDown}>
      {isDown ? `Checkout Disabled: ${payments?.message}` : "Complete Checkout"}
    </button>
  );
}
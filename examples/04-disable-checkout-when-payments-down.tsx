/**
 * Business Outcome: Prevent purchases when the payments capability is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

export function CheckoutButton() {
  const { isOperational, message } = useCapability("payments");

  return (
    <button disabled={!isOperational}>
      {!isOperational ? `Checkout Disabled: ${message}` : "Complete Checkout"}
    </button>
  );
}
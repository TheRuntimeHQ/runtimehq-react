/**
 * Business Outcome: Show meaningful empty states when functionality is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function InvoiceList({ invoices }: { invoices: any[] }) {
  const { getCapabilityState } = useRuntimeHQ();
  const billing = getCapabilityState("billing");

  if (invoices.length === 0) {
    if (billing?.state === "OUTAGE") {
      return (
        <div className="empty-state warn">
          <p>We cannot fetch your invoices right now due to a system issue: {billing.message}</p>
        </div>
      );
    }
    return <p>You have no invoices.</p>;
  }

  return <ul>{invoices.map(i => <li key={i.id}>{i.id}</li>)}</ul>;
}
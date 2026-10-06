/**
 * Business Outcome: Show meaningful empty states when functionality is unavailable.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useCapability } from "@theruntimehq/react";

export function InvoiceList({ invoices }: { invoices: any[] }) {
  const { isOutage, message } = useCapability("billing");

  if (invoices.length === 0) {
    if (isOutage) {
      return (
        <div className="empty-state warn">
          <p>We cannot fetch your invoices right now due to a system issue: {message}</p>
        </div>
      );
    }
    return <p>You have no invoices.</p>;
  }

  return <ul>{invoices.map(i => <li key={i.id}>{i.id}</li>)}</ul>;
}
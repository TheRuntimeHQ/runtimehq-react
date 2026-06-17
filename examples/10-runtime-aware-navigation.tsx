/**
 * Business Outcome: Hide or disable navigation items for unavailable capabilities.
 */
// Note: This component must be rendered inside a <RuntimeHQProvider runtimeKey="...">
import React from "react";
import { useRuntimeHQ } from "@theruntimehq/react";

export function NavigationBar() {
  const { hasCapability, getCapabilityState } = useRuntimeHQ();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Reports", href: "/reports", capability: "reporting" },
  ];

  return (
    <nav>
      {navItems.map((item) => {
        if (item.capability && hasCapability(item.capability)) {
          const cap = getCapabilityState(item.capability);
          if (cap?.state === "OUTAGE") return null; // Hide reports tab during outage
        }
        return <a key={item.label} href={item.href}>{item.label}</a>;
      })}
    </nav>
  );
}
"use client";

import React from "react";
import { RuntimeHQContext } from "../context";
import { useRuntimeHQState } from "../hooks/useRuntimeHQState";

export interface RuntimeHQProviderProps {
  runtimeKey: string;
  intervalSeconds?: number;
  children: React.ReactNode;
}

/**
 * Context Provider that manages a global RuntimeHQ client subscription and polling loop,
 * making the status state available to all child components using `useRuntimeHQ()`.
 */
export function RuntimeHQProvider({
  runtimeKey,
  intervalSeconds,
  children,
}: RuntimeHQProviderProps) {
  const value = useRuntimeHQState({ runtimeKey, intervalSeconds });

  return (
    <RuntimeHQContext.Provider value={value}>
      {children}
    </RuntimeHQContext.Provider>
  );
}

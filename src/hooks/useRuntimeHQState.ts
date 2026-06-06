"use client";

import { useState, useEffect, useMemo } from "react";
import { RuntimeHQClient } from "@theruntimehq/js";
import { RuntimeResponse, RuntimeHQContextValue } from "../types";

export interface UseRuntimeHQStateOptions {
  runtimeKey: string;
  intervalSeconds?: number;
}

/**
 * A direct React hook to fetch and watch RuntimeHQ status without using a Context Provider.
 */
export function useRuntimeHQState(options: UseRuntimeHQStateOptions): RuntimeHQContextValue {
  const { runtimeKey, intervalSeconds = 15 } = options;

  // Safely instantiate RuntimeHQClient
  const [client, clientInitError] = useMemo(() => {
    if (!runtimeKey) {
      return [null, new Error("runtimeKey is required")] as const;
    }
    try {
      return [new RuntimeHQClient({ runtimeKey }), null] as const;
    } catch (err) {
      return [null, err instanceof Error ? err : new Error(String(err))] as const;
    }
  }, [runtimeKey]);

  const [runtime, setRuntime] = useState<RuntimeResponse | null>(null);
  const [error, setError] = useState<Error | null>(clientInitError || null);
  const [loading, setLoading] = useState<boolean>(!clientInitError);

  useEffect(() => {
    if (clientInitError) {
      setError(clientInitError);
      setLoading(false);
      return;
    }

    if (!client) {
      return;
    }

    // Reset states when the client or key changes
    setRuntime(null);
    setError(null);
    setLoading(true);

    let active = true;

    const unsubscribe = client.watchRuntime({
      intervalSeconds,
      onUpdate: (data) => {
        if (active) {
          setRuntime(data);
          setError(null);
          setLoading(false);
        }
      },
      onError: (err) => {
        if (active) {
          setError(err);
          setLoading(false);
        }
      },
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [client, clientInitError, intervalSeconds]);

  return {
    runtime,
    loading,
    error,
  };
}

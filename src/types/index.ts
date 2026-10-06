import { RuntimeResponse, CapabilityState } from "@theruntimehq/js";

export type {
  RuntimeState,
  CapabilityState,
  RuntimeResponse,
  RuntimeHQClientOptions,
  WatchRuntimeOptions,
} from "@theruntimehq/js";

export interface RuntimeHQContextValue {
  runtime: RuntimeResponse | null;
  loading: boolean;
  error: Error | null;
  hasCapability: (name: string) => boolean;
  getCapabilityState: (name: string) => CapabilityState | undefined;
}

export interface UseCapabilityResult {
  capability: CapabilityState | undefined;
  state: RuntimeState;
  message: string;
  isOperational: boolean;
  isDegraded: boolean;
  isOutage: boolean;
  isMaintenance: boolean;
  exists: boolean;
  loading: boolean;
  error: Error | null;
}


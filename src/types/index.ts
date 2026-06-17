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

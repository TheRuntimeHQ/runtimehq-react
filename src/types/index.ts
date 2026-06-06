import { RuntimeResponse } from "@theruntimehq/js";

export type {
  RuntimeState,
  RuntimeSourceType,
  RuntimeResponse,
  RuntimeHQClientOptions,
  WatchRuntimeOptions,
} from "@theruntimehq/js";

export interface RuntimeHQContextValue {
  runtime: RuntimeResponse | null;
  loading: boolean;
  error: Error | null;
}

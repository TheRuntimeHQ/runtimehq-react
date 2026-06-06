# @theruntimehq/react

[![npm version](https://img.shields.io/npm/v/@theruntimehq/react.svg)](https://www.npmjs.com/package/@theruntimehq/react)
[![license](https://img.shields.io/npm/l/@theruntimehq/react.svg)](https://github.com/TheRuntimeHQ/runtimehq-react/blob/main/LICENSE)

The official React state management SDK for [RuntimeHQ](https://theruntimehq.com). Connect your status checks directly to your React primitives.

This SDK is a **pure state management SDK** with:
- 🚫 **No visual UI components** (Customers use their own design systems).
- 🚫 **No CSS, Tailwind, or style sheet dependencies**.
- 🚫 **No external state libraries**.
- ⚛️ Full support for **React 18+ and 19+**.
- 🌐 Native compatibility with Server-Side Rendering (SSR), Vite, Next.js, and Remix.

---

## Installation

Ensure you have `@theruntimehq/js` and React installed in your project:

```bash
npm install @theruntimehq/react @theruntimehq/js
```

---

## Core Hooks & Provider APIs

### 1. Global Provider (`RuntimeHQProvider`)

Wrap your root application with the `RuntimeHQProvider`. It internally manages a single `RuntimeHQClient` and handles global state subscription and cleanup.

```tsx
import { RuntimeHQProvider } from "@theruntimehq/react";

export default function Root() {
  return (
    <RuntimeHQProvider 
      runtimeKey="rt_prod_your_key_here" 
      intervalSeconds={15}
    >
      <App />
    </RuntimeHQProvider>
  );
}
```

#### Provider Props
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `runtimeKey` | `string` | **Yes** | - | Your RuntimeHQ API status key (must start with `rt_prod_` or `rt_test_`). |
| `intervalSeconds` | `number` | No | `15` | Polling interval for updates in seconds. |

---

### 2. Context Hook (`useRuntimeHQ`)

Consume the global status state anywhere inside the provider.

```tsx
import { useRuntimeHQ, isOperational } from "@theruntimehq/react";

function StatusBanner() {
  const { runtime, loading, error } = useRuntimeHQ();

  if (loading) return <div>Checking status...</div>;
  if (error) return <div>Error fetching status: {error.message}</div>;
  if (!runtime || isOperational(runtime)) return null;

  return (
    <div className={`banner ${runtime.state.toLowerCase()}`}>
      ⚠️ {runtime.message}
    </div>
  );
}
```

#### Return Value
```typescript
interface RuntimeHQContextValue {
  runtime: RuntimeResponse | null; // Detailed status info or null before first fetch
  loading: boolean;                // true until the first fetch (success or failure) completes
  error: Error | null;             // Captured network or validation error (if any)
}
```

> [!IMPORTANT]
> If `useRuntimeHQ` is invoked outside a `<RuntimeHQProvider>`, it throws a descriptive error:
> `useRuntimeHQ must be used within a RuntimeHQProvider`

---

### 3. Standalone Direct Hook (`useRuntimeHQState`)

If you want to read runtime status inside isolated widgets without setting up a context provider at the root level, use `useRuntimeHQState`. It shares the same state management and cleanup logic as the provider.

```tsx
import { useRuntimeHQState } from "@theruntimehq/react";

function IndependentWidget() {
  const { runtime, loading, error } = useRuntimeHQState({
    runtimeKey: "rt_prod_your_key_here",
    intervalSeconds: 30,
  });

  if (loading) return <Spinner />;
  return <div>State: {runtime?.state}</div>;
}
```

---

## Convenience Helpers

Quickly determine states using utility checkers. These accept either the full `RuntimeResponse` object, the `RuntimeState` string, or `null`/`undefined`.

```typescript
import { 
  isOperational, 
  isMaintenance, 
  isDegraded, 
  isOutage 
} from "@theruntimehq/react";

// Usage
isOperational(runtime)  // returns boolean
isMaintenance(runtime)  // returns boolean
isDegraded(runtime)     // returns boolean
isOutage(runtime)       // returns boolean
```

---

## Server Rendering (SSR) & Next.js App Router Integration

To avoid layout shifts and flashes of loading states on initial load, fetch the status server-side using the underlying `@theruntimehq/js` SDK directly, and render a static warning component on the server:

```tsx
// src/app/page.tsx (Next.js Server Component)
import { RuntimeHQClient } from "@theruntimehq/js";
import ClientSidePoller from "./ClientSidePoller";

export default async function Page() {
  const client = new RuntimeHQClient({ runtimeKey: process.env.RUNTIMEHQ_KEY! });
  let initialRuntime = null;

  try {
    initialRuntime = await client.getRuntime();
  } catch (err) {
    // Fail-open: ignore server-side fetch errors during build/request
    console.error("Failed to check status during SSR:", err);
  }

  return (
    <main>
      {/* 1. SSR Static Layout (Zero layout shift on load) */}
      {initialRuntime && initialRuntime.state !== "OPERATIONAL" && (
        <div className="banner">
          ⚠️ {initialRuntime.message}
        </div>
      )}

      {/* 2. Client Side Poller (Handles live updates) */}
      <ClientSidePoller initialData={initialRuntime} />
    </main>
  );
}
```

```tsx
// src/app/ClientSidePoller.tsx (Client Component)
"use client";

import { useRuntimeHQState } from "@theruntimehq/react";
import type { RuntimeResponse } from "@theruntimehq/react";

interface ClientSidePollerProps {
  initialData: RuntimeResponse | null;
}

export default function ClientSidePoller({ initialData }: ClientSidePollerProps) {
  const { runtime } = useRuntimeHQState({
    runtimeKey: "rt_prod_your_key_here",
    intervalSeconds: 15,
  });

  // Hydrate client-side with server-fetched data initially
  const currentRuntime = runtime || initialData;

  if (!currentRuntime || currentRuntime.state === "OPERATIONAL") return null;

  return (
    <div className="interactive-status">
      Status is {currentRuntime.state} (Polled: {runtime ? "Yes" : "No"})
    </div>
  );
}
```

## License

MIT

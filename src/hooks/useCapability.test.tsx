// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { RuntimeHQProvider, useCapability } from "../index";
import { RuntimeResponse } from "../types";

// Setup mocks for @theruntimehq/js
const mockWatchRuntime = vi.fn();
const mockGetRuntime = vi.fn();

vi.mock("@theruntimehq/js", () => {
  return {
    RuntimeHQClient: vi.fn().mockImplementation(function (options) {
      if (!options || typeof options.runtimeKey !== "string") {
        throw new Error("runtimeKey is required and must be a string");
      }
      return {
        getRuntime: mockGetRuntime,
        watchRuntime: mockWatchRuntime,
      };
    }),
  };
});

describe("useCapability Hook", () => {
  const createMockPayload = (capabilityStates: any[] = []): RuntimeResponse => ({
    applicationId: "app_123",
    state: "OPERATIONAL",
    message: "All operational",
    capabilityStates,
    version: 1,
    updatedAt: new Date("2026-06-05T12:30:00Z"),
    dataStatus: "FRESH",
    lastSuccessfulFetchAt: new Date(),
    hasCapability: (name: string) => capabilityStates.some((c) => c.capabilityName === name),
    getCapabilityState: (name: string) => capabilityStates.find((c) => c.capabilityName === name),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw a descriptive error if called outside RuntimeHQProvider", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useCapability("search"))).toThrow(
      "useRuntimeHQ must be used within a RuntimeHQProvider"
    );

    consoleErrorSpy.mockRestore();
  });

  it("should return fail-open defaults during initial loading inside provider", () => {
    mockWatchRuntime.mockReturnValue(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RuntimeHQProvider runtimeKey="rt_prod_test">
        {children}
      </RuntimeHQProvider>
    );

    const { result } = renderHook(() => useCapability("search"), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.capability).toBeUndefined();
    expect(result.current.exists).toBe(false);
    expect(result.current.state).toBe("OPERATIONAL");
    expect(result.current.isOperational).toBe(true);
    expect(result.current.isDegraded).toBe(false);
    expect(result.current.isOutage).toBe(false);
    expect(result.current.isMaintenance).toBe(false);
    expect(result.current.message).toBe("");
  });

  it("should return fail-open defaults if the capability is not in the configuration", () => {
    let updateCallback: any = null;
    mockWatchRuntime.mockImplementation((options) => {
      updateCallback = options.onUpdate;
      return () => {};
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RuntimeHQProvider runtimeKey="rt_prod_test">
        {children}
      </RuntimeHQProvider>
    );

    const { result } = renderHook(() => useCapability("non_existent"), { wrapper });

    act(() => {
      updateCallback(createMockPayload([
        { capabilityName: "search", state: "OPERATIONAL", message: "" }
      ]));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.exists).toBe(false);
    expect(result.current.capability).toBeUndefined();
    expect(result.current.state).toBe("OPERATIONAL");
    expect(result.current.isOperational).toBe(true);
    expect(result.current.isDegraded).toBe(false);
    expect(result.current.isOutage).toBe(false);
    expect(result.current.isMaintenance).toBe(false);
    expect(result.current.message).toBe("");
  });

  it("should correctly reflect a DEGRADED capability state", () => {
    let updateCallback: any = null;
    mockWatchRuntime.mockImplementation((options) => {
      updateCallback = options.onUpdate;
      return () => {};
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RuntimeHQProvider runtimeKey="rt_prod_test">
        {children}
      </RuntimeHQProvider>
    );

    const { result } = renderHook(() => useCapability("search"), { wrapper });

    act(() => {
      updateCallback(createMockPayload([
        { capabilityName: "search", state: "DEGRADED", message: "Elasticsearch index latency high" }
      ]));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.exists).toBe(true);
    expect(result.current.state).toBe("DEGRADED");
    expect(result.current.isOperational).toBe(false);
    expect(result.current.isDegraded).toBe(true);
    expect(result.current.isOutage).toBe(false);
    expect(result.current.isMaintenance).toBe(false);
    expect(result.current.message).toBe("Elasticsearch index latency high");
    expect(result.current.capability).toEqual({
      capabilityName: "search",
      state: "DEGRADED",
      message: "Elasticsearch index latency high",
    });
  });

  it("should correctly reflect an OUTAGE capability state", () => {
    let updateCallback: any = null;
    mockWatchRuntime.mockImplementation((options) => {
      updateCallback = options.onUpdate;
      return () => {};
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RuntimeHQProvider runtimeKey="rt_prod_test">
        {children}
      </RuntimeHQProvider>
    );

    const { result } = renderHook(() => useCapability("payments"), { wrapper });

    act(() => {
      updateCallback(createMockPayload([
        { capabilityName: "payments", state: "OUTAGE", message: "Payment gateway connection refused" }
      ]));
    });

    expect(result.current.exists).toBe(true);
    expect(result.current.state).toBe("OUTAGE");
    expect(result.current.isOperational).toBe(false);
    expect(result.current.isDegraded).toBe(false);
    expect(result.current.isOutage).toBe(true);
    expect(result.current.isMaintenance).toBe(false);
    expect(result.current.message).toBe("Payment gateway connection refused");
  });

  it("should correctly reflect a MAINTENANCE capability state", () => {
    let updateCallback: any = null;
    mockWatchRuntime.mockImplementation((options) => {
      updateCallback = options.onUpdate;
      return () => {};
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RuntimeHQProvider runtimeKey="rt_prod_test">
        {children}
      </RuntimeHQProvider>
    );

    const { result } = renderHook(() => useCapability("reports"), { wrapper });

    act(() => {
      updateCallback(createMockPayload([
        { capabilityName: "reports", state: "MAINTENANCE", message: "Scheduled database re-indexing" }
      ]));
    });

    expect(result.current.exists).toBe(true);
    expect(result.current.state).toBe("MAINTENANCE");
    expect(result.current.isOperational).toBe(false);
    expect(result.current.isDegraded).toBe(false);
    expect(result.current.isOutage).toBe(false);
    expect(result.current.isMaintenance).toBe(true);
    expect(result.current.message).toBe("Scheduled database re-indexing");
  });
});

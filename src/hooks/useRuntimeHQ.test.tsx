// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { RuntimeHQProvider, useRuntimeHQ, useRuntimeHQState } from "../index";
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
      const key = options.runtimeKey.trim();
      if (!key.startsWith("rt_prod_") && !key.startsWith("rt_test_")) {
        throw new Error("runtimeKey must start with rt_prod_ or rt_test_");
      }
      return {
        getRuntime: mockGetRuntime,
        watchRuntime: mockWatchRuntime,
      };
    }),
  };
});

describe("React SDK Hooks & Providers", () => {
  const mockPayload: RuntimeResponse = {
    applicationId: "app_123",
    state: "OPERATIONAL",
    message: "All operational",
    sourceType: "OPERATIONAL",
    startedAt: new Date("2026-06-05T12:00:00Z"),
    updatedAt: new Date("2026-06-05T12:30:00Z"),
    dataStatus: "FRESH",
    lastSuccessfulFetchAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useRuntimeHQ Context Consumer", () => {
    it("should throw a descriptive error if called outside RuntimeHQProvider", () => {
      // Suppress react boundary logs in test terminal
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => renderHook(() => useRuntimeHQ())).toThrow(
        "useRuntimeHQ must be used within a RuntimeHQProvider"
      );

      consoleErrorSpy.mockRestore();
    });

    it("should return loading:true and runtime:null on initial mount inside provider", () => {
      mockWatchRuntime.mockReturnValue(() => {});

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeHQProvider runtimeKey="rt_prod_test">
          {children}
        </RuntimeHQProvider>
      );

      const { result } = renderHook(() => useRuntimeHQ(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.runtime).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("should receive status updates from watchRuntime and turn loading:false", () => {
      let updateCallback: any = null;
      mockWatchRuntime.mockImplementation((options) => {
        updateCallback = options.onUpdate;
        return () => {}; // Unsubscribe function
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeHQProvider runtimeKey="rt_prod_test">
          {children}
        </RuntimeHQProvider>
      );

      const { result } = renderHook(() => useRuntimeHQ(), { wrapper });

      // Trigger update callback
      act(() => {
        updateCallback(mockPayload);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.runtime).toEqual(mockPayload);
      expect(result.current.error).toBeNull();
    });

    it("should capture errors from watchRuntime onError", () => {
      let errorCallback: any = null;
      mockWatchRuntime.mockImplementation((options) => {
        errorCallback = options.onError;
        return () => {};
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeHQProvider runtimeKey="rt_prod_test">
          {children}
        </RuntimeHQProvider>
      );

      const { result } = renderHook(() => useRuntimeHQ(), { wrapper });

      const testError = new Error("Simulated network outage");
      act(() => {
        errorCallback(testError);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.runtime).toBeNull();
      expect(result.current.error).toEqual(testError);
    });

    it("should clean up subscription on unmount", () => {
      const unsubscribeMock = vi.fn();
      mockWatchRuntime.mockReturnValue(unsubscribeMock);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeHQProvider runtimeKey="rt_prod_test">
          {children}
        </RuntimeHQProvider>
      );

      const { unmount } = renderHook(() => useRuntimeHQ(), { wrapper });

      expect(unsubscribeMock).not.toHaveBeenCalled();
      unmount();
      expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("useRuntimeHQState (Standalone Hook)", () => {
    it("should run standalone and subscribe to updates without a provider", () => {
      let updateCallback: any = null;
      mockWatchRuntime.mockImplementation((options) => {
        updateCallback = options.onUpdate;
        return () => {};
      });

      const { result } = renderHook(() =>
        useRuntimeHQState({ runtimeKey: "rt_prod_standalone", intervalSeconds: 10 })
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.runtime).toBeNull();

      act(() => {
        updateCallback(mockPayload);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.runtime).toEqual(mockPayload);
    });

    it("should set error immediately if key validation fails sync", () => {
      const { result } = renderHook(() =>
        useRuntimeHQState({ runtimeKey: "invalid_key_format" })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.runtime).toBeNull();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain("runtimeKey must start with rt_prod_ or rt_test_");
    });
  });
});

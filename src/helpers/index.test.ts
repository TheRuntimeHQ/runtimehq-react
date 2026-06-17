import { describe, it, expect, vi } from "vitest";
import { isOperational, isMaintenance, isDegraded, isOutage } from "./index";
import { RuntimeResponse, CapabilityState } from "../types";

describe("Helpers State Utilities", () => {
  const mockResponse = (state: any): RuntimeResponse => ({
    applicationId: "app_123",
    state,
    message: "Test message",
    capabilityStates: [],
    version: 1,
    updatedAt: new Date(),
    dataStatus: "FRESH",
    lastSuccessfulFetchAt: new Date(),
    hasCapability: vi.fn(),
    getCapabilityState: vi.fn(),
  });

  const mockCapability = (state: any): CapabilityState => ({
    capabilityName: "payments",
    state,
    message: "Test capability message",
  });

  describe("isOperational", () => {
    it("should return true for OPERATIONAL state", () => {
      expect(isOperational("OPERATIONAL")).toBe(true);
      expect(isOperational(mockResponse("OPERATIONAL"))).toBe(true);
      expect(isOperational(mockCapability("OPERATIONAL"))).toBe(true);
    });

    it("should return false for non-OPERATIONAL states and empty inputs", () => {
      expect(isOperational("MAINTENANCE")).toBe(false);
      expect(isOperational(mockResponse("OUTAGE"))).toBe(false);
      expect(isOperational(null)).toBe(false);
      expect(isOperational(undefined)).toBe(false);
    });
  });

  describe("isMaintenance", () => {
    it("should return true for MAINTENANCE state", () => {
      expect(isMaintenance("MAINTENANCE")).toBe(true);
      expect(isMaintenance(mockResponse("MAINTENANCE"))).toBe(true);
      expect(isMaintenance(mockCapability("MAINTENANCE"))).toBe(true);
    });

    it("should return false for non-MAINTENANCE states and empty inputs", () => {
      expect(isMaintenance("OPERATIONAL")).toBe(false);
      expect(isMaintenance(mockResponse("DEGRADED"))).toBe(false);
      expect(isMaintenance(null)).toBe(false);
      expect(isMaintenance(undefined)).toBe(false);
    });
  });

  describe("isDegraded", () => {
    it("should return true for DEGRADED state", () => {
      expect(isDegraded("DEGRADED")).toBe(true);
      expect(isDegraded(mockResponse("DEGRADED"))).toBe(true);
      expect(isDegraded(mockCapability("DEGRADED"))).toBe(true);
    });

    it("should return true when passed a DEGRADED capability from getCapabilityState", () => {
      const response = mockResponse("OPERATIONAL");
      const searchCapability = mockCapability("DEGRADED");
      searchCapability.capabilityName = "search";
      
      (response.getCapabilityState as any).mockImplementation((name: string) => {
        if (name === "search") return searchCapability;
        return undefined;
      });

      expect(isDegraded(response.getCapabilityState("search"))).toBe(true);
      expect(isDegraded(response.getCapabilityState("non-existent"))).toBe(false);
    });

    it("should return false for non-DEGRADED states and empty inputs", () => {
      expect(isDegraded("OPERATIONAL")).toBe(false);
      expect(isDegraded(mockResponse("OUTAGE"))).toBe(false);
      expect(isDegraded(null)).toBe(false);
      expect(isDegraded(undefined)).toBe(false);
    });
  });

  describe("isOutage", () => {
    it("should return true for OUTAGE state", () => {
      expect(isOutage("OUTAGE")).toBe(true);
      expect(isOutage(mockResponse("OUTAGE"))).toBe(true);
      expect(isOutage(mockCapability("OUTAGE"))).toBe(true);
    });

    it("should return false for non-OUTAGE states and empty inputs", () => {
      expect(isOutage("OPERATIONAL")).toBe(false);
      expect(isOutage(mockResponse("MAINTENANCE"))).toBe(false);
      expect(isOutage(null)).toBe(false);
      expect(isOutage(undefined)).toBe(false);
    });
  });
});

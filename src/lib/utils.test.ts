import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { THRESHOLD } from "../constants";
import { getCurrentTimeInSeconds, calculateRaceTime } from "./utils";

describe("utils", () => {
  describe("getCurrentTimeInSeconds", () => {
    it("should return current time in seconds", () => {
      const now = Math.floor(Date.now() / 1000);
      const result = getCurrentTimeInSeconds();
      expect(result).toBeGreaterThanOrEqual(now);
      expect(result).toBeLessThanOrEqual(now + 1);
    });
  });

  describe("calculateRaceTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should show countdown for future race", () => {
      const now = new Date("2024-01-01T12:00:00Z");
      vi.setSystemTime(now);

      const futureTime = Math.floor(now.getTime() / 1000) + 300; // 5 minutes in future
      const result = calculateRaceTime(futureTime, THRESHOLD);

      expect(result.timeString).toBe("5m 0s To Start");
      expect(result.shouldRemove).toBe(false);
      expect(result.hasStarted).toBe(false);
      expect(result.timeDiff).toBe(300);
    });

    it("should show elapsed time for started race", () => {
      const now = new Date("2024-01-01T12:00:00Z");
      vi.setSystemTime(now);

      const pastTime = Math.floor(now.getTime() / 1000) - 30; // 30 seconds ago
      const result = calculateRaceTime(pastTime, THRESHOLD);

      expect(result.timeString).toBe("Started 0m 30s ago");
      expect(result.shouldRemove).toBe(false);
      expect(result.hasStarted).toBe(true);
      expect(result.timeDiff).toBe(-30);
    });

    it("should mark race for removal after threshold", () => {
      const now = new Date("2024-01-01T12:00:00Z");
      vi.setSystemTime(now);

      const pastTime = Math.floor(now.getTime() / 1000) - 120; // 2 minutes ago
      const result = calculateRaceTime(pastTime, THRESHOLD);

      expect(result.shouldRemove).toBe(true);
      expect(result.hasStarted).toBe(true);
    });

    it("should not mark race for removal before threshold", () => {
      const now = new Date("2024-01-01T12:00:00Z");
      vi.setSystemTime(now);

      const pastTime = Math.floor(now.getTime() / 1000) - 30; // 30 seconds ago
      const result = calculateRaceTime(pastTime, THRESHOLD);

      expect(result.shouldRemove).toBe(false);
      expect(result.hasStarted).toBe(true);
    });

    it("should use custom threshold", () => {
      const now = new Date("2024-01-01T12:00:00Z");
      vi.setSystemTime(now);

      const pastTime = Math.floor(now.getTime() / 1000) - 45; // 45 seconds ago
      const result = calculateRaceTime(pastTime, 30);

      expect(result.shouldRemove).toBe(true);
    });

    it("should handle exact threshold boundary", () => {
      const now = new Date("2024-01-01T12:00:00Z");
      vi.setSystemTime(now);

      const pastTime = Math.floor(now.getTime() / 1000) - THRESHOLD;
      const result = calculateRaceTime(pastTime, THRESHOLD);

      expect(result.shouldRemove).toBe(true);
      expect(result.hasStarted).toBe(true);
    });
  });
});

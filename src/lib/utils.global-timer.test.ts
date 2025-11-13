import { describe, it, expect, vi } from "vitest";
import { calculateRaceTime, getCurrentTimeInSeconds } from "./utils";

describe("utils - calculateRaceTime with global timer support", () => {
  describe("calculateRaceTime with custom currentTime", () => {
    it("should use provided currentTimeSeconds instead of system time", () => {
      const raceStartTime = 1000;
      const customCurrentTime = 950; // 50 seconds before race

      const result = calculateRaceTime(raceStartTime, 60, customCurrentTime);

      expect(result.timeDiff).toBe(50);
      expect(result.timeString).toBe("0m 50s To Start");
      expect(result.hasStarted).toBe(false);
      expect(result.shouldRemove).toBe(false);
    });

    it("should calculate expired race correctly with custom time", () => {
      const raceStartTime = 1000;
      const customCurrentTime = 1070; // 70 seconds after race (expired)

      const result = calculateRaceTime(raceStartTime, 60, customCurrentTime);

      expect(result.timeDiff).toBe(-70);
      expect(result.timeString).toBe("Started 1m 10s ago");
      expect(result.hasStarted).toBe(true);
      expect(result.shouldRemove).toBe(true);
    });

    it("should handle race at exact threshold with custom time", () => {
      const raceStartTime = 1000;
      const customCurrentTime = 1060; // Exactly 60 seconds after (threshold)

      const result = calculateRaceTime(raceStartTime, 60, customCurrentTime);

      expect(result.timeDiff).toBe(-60);
      expect(result.hasStarted).toBe(true);
      expect(result.shouldRemove).toBe(true);
    });

    it("should fall back to system time when currentTimeSeconds not provided", () => {
      const mockCurrentTime = 1500;
      vi.spyOn(Date, "now").mockReturnValue(mockCurrentTime * 1000);

      const raceStartTime = 1600; // 100 seconds in future

      const result = calculateRaceTime(raceStartTime, 60);

      expect(result.timeDiff).toBe(100);
      expect(result.hasStarted).toBe(false);

      vi.restoreAllMocks();
    });

    it("should work with custom threshold and custom time", () => {
      const raceStartTime = 1000;
      const customCurrentTime = 1030; // 30 seconds after race
      const customThreshold = 20; // 20 second threshold instead of 60

      const result = calculateRaceTime(raceStartTime, customThreshold, customCurrentTime);

      expect(result.timeDiff).toBe(-30);
      expect(result.hasStarted).toBe(true);
      expect(result.shouldRemove).toBe(true); // 30s > 20s threshold
    });

    it("should maintain backward compatibility", () => {
      const mockCurrentTime = 2000;
      vi.spyOn(Date, "now").mockReturnValue(mockCurrentTime * 1000);

      const raceStartTime = 2120; // 120 seconds in future

      // Old way - without custom time parameter
      const result1 = calculateRaceTime(raceStartTime, 60);
      // New way - with custom time parameter
      const result2 = calculateRaceTime(raceStartTime, 60, mockCurrentTime);

      expect(result1.timeDiff).toBe(result2.timeDiff);
      expect(result1.timeString).toBe(result2.timeString);
      expect(result1.hasStarted).toBe(result2.hasStarted);
      expect(result1.shouldRemove).toBe(result2.shouldRemove);

      vi.restoreAllMocks();
    });

    it("should handle negative time differences correctly", () => {
      const raceStartTime = 1000;
      const customCurrentTime = 1015; // 15 seconds after race start

      const result = calculateRaceTime(raceStartTime, 60, customCurrentTime);

      expect(result.timeDiff).toBe(-15);
      expect(result.timeString).toBe("Started 0m 15s ago");
      expect(result.hasStarted).toBe(true);
      expect(result.shouldRemove).toBe(false); // 15s < 60s threshold
    });

    it("should handle large time differences", () => {
      const raceStartTime = 1000;
      const customCurrentTime = 1500; // 500 seconds (8+ minutes) after race

      const result = calculateRaceTime(raceStartTime, 60, customCurrentTime);

      expect(result.timeDiff).toBe(-500);
      expect(result.timeString).toBe("Started 8m 20s ago");
      expect(result.hasStarted).toBe(true);
      expect(result.shouldRemove).toBe(true);
    });
  });

  describe("getCurrentTimeInSeconds", () => {
    it("should return current time in seconds", () => {
      const mockNow = 1234567890123; // Mock timestamp in milliseconds
      vi.spyOn(Date, "now").mockReturnValue(mockNow);

      const result = getCurrentTimeInSeconds();

      expect(result).toBe(Math.floor(mockNow / 1000));
      expect(result).toBe(1234567890);

      vi.restoreAllMocks();
    });

    it("should return integer seconds", () => {
      const result = getCurrentTimeInSeconds();

      expect(Number.isInteger(result)).toBe(true);
    });
  });
});

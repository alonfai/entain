import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useGlobalTimer } from "./useGlobalTimer";

describe("useGlobalTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial current time in seconds", async () => {
    const { result } = await renderHook(() => useGlobalTimer());

    // Should return current time as seconds (Unix timestamp)
    expect(result.current).toBeTypeOf("number");
    expect(result.current).toBeGreaterThan(0);
  });

  it("should cleanup interval on unmount", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = await renderHook(() => useGlobalTimer());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it("should start timer immediately on mount", async () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    await renderHook(() => useGlobalTimer());

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    setIntervalSpy.mockRestore();
  });

  it("should provide consistent time across multiple hook instances", async () => {
    const { result: result1 } = await renderHook(() => useGlobalTimer());
    const { result: result2 } = await renderHook(() => useGlobalTimer());

    // Both instances should return the same time initially (within 1 second)
    expect(Math.abs(result1.current - result2.current)).toBeLessThanOrEqual(1);
  });

  it("should use Math.floor(Date.now() / 1000) for current time", async () => {
    const mockTime = 1762996256789; // Mock timestamp in milliseconds
    vi.spyOn(Date, "now").mockReturnValue(mockTime);

    const { result } = await renderHook(() => useGlobalTimer());

    expect(result.current).toBe(Math.floor(mockTime / 1000));

    vi.mocked(Date.now).mockRestore();
  });

  it("should call setInterval with correct parameters", async () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    await renderHook(() => useGlobalTimer());

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);

    setIntervalSpy.mockRestore();
  });

  it("should setup and cleanup interval properly", async () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = await renderHook(() => useGlobalTimer());

    // Verify interval was set up
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    // Unmount to trigger cleanup
    unmount();

    // Verify interval was cleaned up
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });
});

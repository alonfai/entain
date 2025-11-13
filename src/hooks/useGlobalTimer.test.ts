import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useGlobalTimer } from "./useGlobalTimer";

describe.skip("useGlobalTimer", () => {
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

  it("should update current time every second", async () => {
    const { result } = await renderHook(() => useGlobalTimer());
    
    const initialTime = result.current;
    
    // Advance time by 1 second
    vi.advanceTimersByTime(1000);
    
    expect(result.current).toBe(initialTime + 1);
  });

  it("should update current time multiple times", async () => {
    const { result } = await renderHook(() => useGlobalTimer());
    
    const initialTime = result.current;
    
    // Advance time by 3 seconds
    vi.advanceTimersByTime(3000);
    
    expect(result.current).toBe(initialTime + 3);
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
    
    // Both instances should return the same time initially
    expect(result1.current).toBe(result2.current);
    
    // Advance time
    vi.advanceTimersByTime(2000);
    
    // Both instances should still be synchronized
    expect(result1.current).toBe(result2.current);
    expect(result1.current).toBeGreaterThan(0);
  });

  it("should handle rapid timer updates correctly", async () => {
    const { result } = await renderHook(() => useGlobalTimer());
    
    const initialTime = result.current;
    
    // Advance time rapidly multiple times
    for (let i = 1; i <= 5; i++) {
      vi.advanceTimersByTime(1000);
      expect(result.current).toBe(initialTime + i);
    }
  });
});

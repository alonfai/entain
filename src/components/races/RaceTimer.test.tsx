import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-react";
import { RaceTimer } from "./RaceTimer";
import type { RaceSummary } from "@/types";
import { getCurrentTimeInSeconds } from "../../lib/utils";

describe("RaceTimer", () => {
  let currentTimeInSeconds: number;

  beforeEach(() => {
    vi.useFakeTimers();
    currentTimeInSeconds = getCurrentTimeInSeconds();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockRace = (secondsOffset: number): RaceSummary => ({
    race_id: "test-race-1",
    race_name: "Test Race",
    race_number: 1,
    meeting_id: "test-meeting",
    meeting_name: "Test Meeting",
    category_id: "test-category",
    advertised_start: {
      seconds: Math.floor(Date.now() / 1000) + secondsOffset,
    },
    race_form: {
      distance: 1000,
      distance_type: { id: "1", name: "Meters", short_name: "m" },
      distance_type_id: "1",
      track_condition: { id: "1", name: "Good", short_name: "good" },
      track_condition_id: "1",
      weather: {
        id: "1",
        name: "Fine",
        short_name: "fine",
        icon_uri: "FINE",
      },
      weather_id: "1",
      race_comment: "",
      additional_data: "",
      generated: 0,
      silk_base_url: "",
      race_comment_alternative: "",
    },
    venue_id: "test-venue",
    venue_name: "Test Venue",
    venue_state: "Test State",
    venue_country: "Test Country",
  });

  it("should display countdown for future race", async () => {
    const onShouldRemove = vi.fn();
    const futureRace = createMockRace(300); // 5 minutes in future
    const { getByText } = await render(
      <RaceTimer
        row={futureRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    await expect.element(getByText("5m 0s To Start")).toBeInTheDocument();
  });

  it("should display elapsed time for started race", async () => {
    const pastRace = createMockRace(-30); // 30 seconds ago
    const onShouldRemove = vi.fn();
    const { getByText } = await render(
      <RaceTimer
        row={pastRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    await expect.element(getByText("Started 0m 30s ago")).toBeInTheDocument();
  });

  it("should update timer when currentTime prop changes", async () => {
    const futureRace = createMockRace(120); // 2 minutes in future
    const onShouldRemove = vi.fn();
    const { getByText, rerender } = await render(
      <RaceTimer
        row={futureRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    await expect.element(getByText("2m 0s To Start")).toBeInTheDocument();

    // Simulate global timer advancing by 1 second
    await rerender(
      <RaceTimer
        row={futureRace}
        currentTime={currentTimeInSeconds + 1}
        onShouldRemove={onShouldRemove}
      />,
    );

    await expect.element(getByText("1m 59s To Start")).toBeInTheDocument();
  });

  it("should call onShouldRemove when race should be removed", async () => {
    const onShouldRemove = vi.fn();
    const expiredRace = createMockRace(-120); // 2 minutes ago

    await render(
      <RaceTimer
        row={expiredRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    expect(onShouldRemove).toHaveBeenCalled();
  });

  it("should not call onShouldRemove for active races", async () => {
    const onShouldRemove = vi.fn();
    const activeRace = createMockRace(60); // 1 minute in future

    await render(
      <RaceTimer
        row={activeRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    // Since the component doesn't manage its own timer,
    // we don't need to advance timers - just ensure it wasn't called initially
    expect(onShouldRemove).not.toHaveBeenCalled();
  });

  it("should call onShouldRemove only once when race becomes expired", async () => {
    const onShouldRemove = vi.fn();
    const raceAboutToExpire = createMockRace(-59); // 59 seconds ago, not yet expired

    const { rerender } = await render(
      <RaceTimer
        row={raceAboutToExpire}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    // Should not be called yet (59 seconds < 60 second threshold)
    expect(onShouldRemove).not.toHaveBeenCalled();

    // Advance current time to make race expired (61 seconds ago)
    await rerender(
      <RaceTimer
        row={raceAboutToExpire}
        currentTime={currentTimeInSeconds + 2}
        onShouldRemove={onShouldRemove}
      />,
    );

    // Should be called once when race becomes expired
    expect(onShouldRemove).toHaveBeenCalledTimes(1);
    expect(onShouldRemove).toHaveBeenCalledWith(raceAboutToExpire);

    // Advance time further, should not call again
    await rerender(
      <RaceTimer
        row={raceAboutToExpire}
        currentTime={currentTimeInSeconds + 10}
        onShouldRemove={onShouldRemove}
      />,
    );

    // Should still be called only once
    expect(onShouldRemove).toHaveBeenCalledTimes(1);
  });

  it("should reset notification flag if race becomes unexpired", async () => {
    const onShouldRemove = vi.fn();
    const expiredRace = createMockRace(-120); // 2 minutes ago (expired)

    const { rerender } = await render(
      <RaceTimer
        row={expiredRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    // Should be called initially for expired race
    expect(onShouldRemove).toHaveBeenCalledTimes(1);

    // Simulate time going backwards (edge case - race becomes unexpired)
    await rerender(
      <RaceTimer
        row={expiredRace}
        currentTime={currentTimeInSeconds - 200} // Much earlier time
        onShouldRemove={onShouldRemove}
      />,
    );

    // Then make it expired again
    await rerender(
      <RaceTimer
        row={expiredRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    // Should be called again since notification flag was reset
    expect(onShouldRemove).toHaveBeenCalledTimes(2);
  });

  it("should display correct CSS classes for different race states", async () => {
    const onShouldRemove = vi.fn();

    // Future race (more than 1 minute away)
    const futureRace = createMockRace(300); // 5 minutes
    const { container: futureContainer } = await render(
      <RaceTimer
        row={futureRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    const futureSpan = futureContainer.querySelector("span");
    expect(futureSpan).toHaveClass("bg-(--custom-success)");

    // Starting soon race (less than 1 minute, not started)
    const soonRace = createMockRace(30); // 30 seconds
    const { container: soonContainer } = await render(
      <RaceTimer
        row={soonRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    const soonSpan = soonContainer.querySelector("span");
    expect(soonSpan).toHaveClass("bg-(--custom-warning)");

    // Started race
    const startedRace = createMockRace(-30); // 30 seconds ago
    const { container: startedContainer } = await render(
      <RaceTimer
        row={startedRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    const startedSpan = startedContainer.querySelector("span");
    expect(startedSpan).toHaveClass("bg-(--custom-error)");
  });

  it("should handle exact boundary conditions", async () => {
    const onShouldRemove = vi.fn();

    // Race that started exactly 60 seconds ago (should be removed)
    const exactlyExpiredRace = createMockRace(-60);
    await render(
      <RaceTimer
        row={exactlyExpiredRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    expect(onShouldRemove).toHaveBeenCalledWith(exactlyExpiredRace);

    // Race that started 59 seconds ago (should NOT be removed)
    const almostExpiredRace = createMockRace(-59);
    const onShouldRemove2 = vi.fn();
    await render(
      <RaceTimer
        row={almostExpiredRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove2}
      />,
    );

    expect(onShouldRemove2).not.toHaveBeenCalled();
  });

  it("should handle zero and negative time differences correctly", async () => {
    const onShouldRemove = vi.fn();

    // Race starting exactly now
    const nowRace = createMockRace(0);
    const { getByText } = await render(
      <RaceTimer
        row={nowRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    await expect.element(getByText("Started 0m 0s ago")).toBeInTheDocument();
    expect(onShouldRemove).not.toHaveBeenCalled(); // Just started, not expired yet
  });

  it("should update properly when race prop changes", async () => {
    const onShouldRemove = vi.fn();
    const race1 = createMockRace(300);
    const race2 = createMockRace(120);

    const { getByText, rerender } = await render(
      <RaceTimer row={race1} currentTime={currentTimeInSeconds} onShouldRemove={onShouldRemove} />,
    );

    // Initially showing race1 time
    await expect.element(getByText("5m 0s To Start")).toBeInTheDocument();

    // Change to different race
    await rerender(
      <RaceTimer row={race2} currentTime={currentTimeInSeconds} onShouldRemove={onShouldRemove} />,
    );

    // Should now show race2 time
    await expect.element(getByText("2m 0s To Start")).toBeInTheDocument();
  });

  it("should not manage its own timer (uses global timer)", async () => {
    const futureRace = createMockRace(300);
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const onShouldRemove = vi.fn();

    const { unmount } = await render(
      <RaceTimer
        row={futureRace}
        currentTime={currentTimeInSeconds}
        onShouldRemove={onShouldRemove}
      />,
    );

    // Should not create its own interval since it uses global timer
    expect(setIntervalSpy).not.toHaveBeenCalled();

    unmount();

    // Should not clear interval since it doesn't manage one
    expect(clearIntervalSpy).not.toHaveBeenCalled();

    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });
});

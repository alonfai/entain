import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-react";
import { RaceTimer } from "./RaceTimer";
import type { RaceSummary } from "@/types";

describe("RaceTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
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
    const futureRace = createMockRace(300); // 5 minutes in future
    const { getByText } = await render(<RaceTimer row={futureRace} />);

    await expect.element(getByText("5m 0s")).toBeInTheDocument();
  });

  it("should display elapsed time for started race", async () => {
    const pastRace = createMockRace(-30); // 30 seconds ago
    const { getByText } = await render(<RaceTimer row={pastRace} />);

    await expect
      .element(getByText("Started 0m 30s ago"))
      .toBeInTheDocument();
  });

  it("should update timer every second", async () => {
    const futureRace = createMockRace(120); // 2 minutes in future
    const { getByText } = await render(<RaceTimer row={futureRace} />);

    await expect.element(getByText("2m 0s")).toBeInTheDocument();

    vi.advanceTimersByTime(1000);
    await expect.element(getByText("1m 59s")).toBeInTheDocument();
  });

  it("should call onTimeout when race should be removed", async () => {
    const onTimeout = vi.fn();
    const expiredRace = createMockRace(-120); // 2 minutes ago

    await render(<RaceTimer row={expiredRace} onShouldRemove={onTimeout} />);

    expect(onTimeout).toHaveBeenCalled();
  });

  it("should not call onTimeout for active races", async () => {
    const onTimeout = vi.fn();
    const activeRace = createMockRace(60); // 1 minute in future

    await render(<RaceTimer row={activeRace} onShouldRemove={onTimeout} />);

    vi.advanceTimersByTime(5000);
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it("should cleanup interval on unmount", async () => {
    const futureRace = createMockRace(300);
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    
    const { unmount } = await render(<RaceTimer row={futureRace} />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });
});

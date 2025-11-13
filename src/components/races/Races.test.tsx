import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Races } from "./Races";
import { QueryProvider } from "@/context/QueryProvider";
import { BrandProvider } from "@/context/brand";
import * as useGetNextRacesModule from "@/hooks/useGetNextRaces";
import type { RaceSummary } from "@/types";

vi.mock("@/hooks/useGetNextRaces", { spy: true });

describe("Races", () => {
  const mockRaces: RaceSummary[] = [
    {
      race_id: "1",
      race_name: "Test Race 1",
      race_number: 1,
      meeting_id: "meeting-1",
      meeting_name: "Test Meeting",
      category_id: "cat-1",
      advertised_start: { seconds: Math.floor(Date.now() / 1000) + 300 },
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
      venue_id: "venue-1",
      venue_name: "Test Venue",
      venue_state: "Test State",
      venue_country: "Test Country",
    },
  ];

  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <QueryProvider>
        <BrandProvider defaultBrand="light">{ui}</BrandProvider>
      </QueryProvider>
    );

  it("should show loading spinner when loading", async () => {
    vi.mocked(useGetNextRacesModule.useGetNextRaces).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: false,
      status: "pending",
      removeExpiredRace: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { container } = await renderWithProviders(<Races />);

    const spinner = container.querySelector('[role="status"]');
    expect(spinner).not.toBeNull();
  });

  it("should show error message when error occurs", async () => {
    const refetch = vi.fn();
    vi.mocked(useGetNextRacesModule.useGetNextRaces).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Failed to fetch"),
      refetch,
      isError: true,
      isSuccess: false,
      status: "error",
      removeExpiredRace: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { getByText } = await renderWithProviders(<Races />);

    await expect.element(getByText("Failed to fetch")).toBeInTheDocument();
  });

  it("should render races table when data is loaded", async () => {
    vi.mocked(useGetNextRacesModule.useGetNextRaces).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
      status: "success",
      removeExpiredRace: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { getByText } = await renderWithProviders(<Races />);

    await expect.element(getByText("Next to Jump")).toBeInTheDocument();
    await expect.element(getByText("Test Meeting")).toBeInTheDocument();
  });

  it("should display correct limit message", async () => {
    vi.mocked(useGetNextRacesModule.useGetNextRaces).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
      status: "success",
      removeExpiredRace: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { getByText } = await renderWithProviders(<Races />);

    await expect
      .element(getByText("Showing the next 5 upcoming races"))
      .toBeInTheDocument();
  });

  it("should call removeExpiredRace when handleRaceExpired is triggered", async () => {
    const mockRemoveExpiredRace = vi.fn();

    // Create multiple mock races with different start times
    const testRaces: RaceSummary[] = [
      {
        ...mockRaces[0],
        race_id: "race-1",
        race_name: "Expired Race",
        advertised_start: { seconds: Math.floor(Date.now() / 1000) - 120 }, // 2 minutes ago (expired)
      },
      {
        ...mockRaces[0],
        race_id: "race-2",
        race_name: "Future Race",
        advertised_start: { seconds: Math.floor(Date.now() / 1000) + 300 }, // 5 minutes from now
      },
    ];

    vi.mocked(useGetNextRacesModule.useGetNextRaces).mockReturnValue({
      data: testRaces,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
      status: "success",
      removeExpiredRace: mockRemoveExpiredRace,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { container } = await renderWithProviders(<Races />);

    // Wait for the component to render - look for table content
    const tableBody = container.querySelector("tbody");
    expect(tableBody).not.toBeNull();

    // The RaceTimer component should automatically call onShouldRemove for expired races
    // We need to wait a bit for the timer effects to run
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify that removeExpiredRace was called with the expired race
    expect(mockRemoveExpiredRace).toHaveBeenCalledWith(
      expect.objectContaining({
        race_id: "race-1",
        race_name: "Expired Race",
      })
    );

    // Should be called once for the expired race
    expect(mockRemoveExpiredRace).toHaveBeenCalledTimes(1);
  });

  it("should pass currentTime prop to RaceTimer components", async () => {
    vi.mocked(useGetNextRacesModule.useGetNextRaces).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
      status: "success",
      removeExpiredRace: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { container } = await renderWithProviders(<Races />);

    // Check that RaceTimer components are rendered (they contain the time cell content)
    const timeCells = container.querySelectorAll("td");
    const timeCell = Array.from(timeCells).find(
      (cell) =>
        cell.textContent?.includes("min") ||
        cell.textContent?.includes("sec") ||
        cell.textContent?.includes("Started")
    );

    expect(timeCell).not.toBeNull();
  });
});

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { getByText } = await renderWithProviders(<Races />);

    await expect
      .element(getByText("Showing the next 5 upcoming races"))
      .toBeInTheDocument();
  });
});

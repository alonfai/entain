import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "vitest-browser-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as fetchNextRacesModule from "@/api/fetch-next-races";
import type { RacesResponse } from "@/types";
import { CATEGORY_IDS, type CategoryName } from "@/constants";
import { useGetNextRaces } from "./useGetNextRaces";

vi.mock("@/api/fetch-next-races", { spy: true });

describe("useGetNextRaces", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.resetAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const mockResponse: RacesResponse = {
    status: "success",
    data: {
      race_summaries: {
        "race-1": {
          race_id: "race-1",
          race_name: "Test Race 1",
          race_number: 1,
          meeting_id: "meeting-1",
          meeting_name: "Test Meeting",
          category_id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61", // Greyhound Racing
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
        "race-2": {
          race_id: "race-2",
          race_name: "Test Race 2",
          race_number: 2,
          meeting_id: "meeting-2",
          meeting_name: "Test Meeting 2",
          category_id: "4a2788f8-e825-4d36-9894-efd4baf1cfae", // Harness Racing
          advertised_start: { seconds: Math.floor(Date.now() / 1000) + 600 },
          race_form: {
            distance: 2000,
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
          venue_id: "venue-2",
          venue_name: "Test Venue 2",
          venue_state: "Test State",
          venue_country: "Test Country",
        },
      },
      next_to_go_ids: ["race-1", "race-2"],
    },
    message: "success",
  };

  it("should fetch and return all races when no category is specified", async () => {
    vi.mocked(fetchNextRacesModule.fetchNextRaces).mockResolvedValueOnce(
      mockResponse
    );

    const { result } = await renderHook(() => useGetNextRaces(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
  });

  it("should filter races by category", async () => {
    vi.mocked(fetchNextRacesModule.fetchNextRaces).mockResolvedValueOnce(
      mockResponse
    );
    const categoryName: CategoryName = "GREYHOUND";

    const { result } = await renderHook(
      () => useGetNextRaces({ categoryName }),
      { wrapper }
    );

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]?.category_id).toBe(
      CATEGORY_IDS[categoryName]
    );
  });

  it("should filter out expired races", async () => {
    const expiredResponse: RacesResponse = {
      ...mockResponse,
      data: {
        race_summaries: {
          "race-expired": {
            ...mockResponse.data.race_summaries["race-1"]!,
            race_id: "race-expired",
            advertised_start: {
              seconds: Math.floor(Date.now() / 1000) - 120,
            }, // 2 minutes ago
          },
        },
        next_to_go_ids: ["race-expired"],
      },
    };

    vi.mocked(fetchNextRacesModule.fetchNextRaces).mockResolvedValueOnce(
      expiredResponse
    );

    const { result } = await renderHook(() => useGetNextRaces(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(0);
  });

  it("should return empty array when data is undefined", async () => {
    vi.mocked(fetchNextRacesModule.fetchNextRaces).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    const { result } = await renderHook(() => useGetNextRaces(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });
});

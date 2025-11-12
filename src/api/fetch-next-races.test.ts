import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { RacesResponse } from "@/types";
import { fetchNextRaces, API_DOMAIN } from "./fetch-next-races";

describe("fetchNextRaces", () => {
  const mockResponse: RacesResponse = {
    status: "success",
    data: {
      race_summaries: {
        "race-1": {
          race_id: "race-1",
          race_name: "Test Race",
          race_number: 1,
          meeting_id: "meeting-1",
          meeting_name: "Test Meeting",
          category_id: "test-category",
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
      },
      next_to_go_ids: ["race-1"],
    },
    message: "success",
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should fetch next races with default count", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchNextRaces();

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_DOMAIN}?method=nextraces&count=20`,
      {
        headers: {
          method: "GET",
          accept: "application/json",
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fetch next races with custom count", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchNextRaces({ count: 50 });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_DOMAIN}?method=nextraces&count=50`,
      {
        headers: {
          method: "GET",
          accept: "application/json",
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw error when response is not ok", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    } as Response);

    await expect(fetchNextRaces()).rejects.toThrow(
      "Failed to fetch next races: Internal Server Error"
    );
  });

  it("should throw error when fetch fails", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchNextRaces()).rejects.toThrow("Network error");
  });

  it("should return parsed JSON response", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchNextRaces({ count: 10 });

    expect(result).toEqual(mockResponse);
    expect(result.status).toBe("success");
    expect(result.data.race_summaries).toHaveProperty("race-1");
  });

  it("should use correct API domain", () => {
    expect(API_DOMAIN).toBe("/api");
  });
});

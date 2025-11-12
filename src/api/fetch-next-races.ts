import type { RacesResponse } from "../types";

/**
 * Number of records to fetch per batch
 */
const FETCH_BATCH_SIZE = 20;

/**
 * Parameters for fetching
 */
export type Params = {
  /** Number of records to fetch (default to 20) */
  count?: number;
};

/**
 * API domain path for next races (proxied through vite.config.ts server config)
 */
export const API_DOMAIN = "/api";

export async function fetchNextRaces(
  { count }: Params = {
    count: FETCH_BATCH_SIZE,
  }
): Promise<RacesResponse> {
  const response = await fetch(
    `${API_DOMAIN}?method=nextraces&count=${count}`,
    {
      headers: {
        method: "GET",
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch next races: ${response.statusText}`);
  }

  const data = (await response.json()) as RacesResponse;
  return data;
}

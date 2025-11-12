import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { fetchNextRaces } from "../api/fetch-next-races";
import { calculateRaceTime } from "../lib/utils";

/**
 * Hook to fetch next races api data based on category and target count
 */
export function useGetNextRaces() {
  // Maintain a set of expired race IDs to prevent them from reappearing
  const expiredRaceIds = useRef(new Set<string>());

  const queryResult = useQuery({
    queryKey: ["next-races"],
    queryFn: () => fetchNextRaces(),
    refetchInterval: 60000, // Refetch every 60 seconds to get fresh
    select: (res) => {
      // Extract races array from the response json
      const racesArray = Object.values(res.data.race_summaries);

      // Filter out expired races (started more than 60 seconds ago)
      const activeRaces = racesArray.filter((race) => {
        // Skip races that have already been marked as expired
        if (expiredRaceIds.current.has(race.race_id)) {
          return false;
        }

        const { shouldRemove } = calculateRaceTime(
          race.advertised_start.seconds
        );

        // If race should be removed, add it to the expired set
        if (shouldRemove) {
          expiredRaceIds.current.add(race.race_id);
          return false;
        }

        return true;
      });

      return activeRaces;
    },
  });

  // Function to mark a race as expired
  const markRaceAsExpired = (raceId: string) => {
    expiredRaceIds.current.add(raceId);
    // Invalidate the query to trigger a re-render with updated filters
    queryResult.refetch();
  };

  return {
    ...queryResult,
    data: queryResult.data ?? [],
    markRaceAsExpired,
  };
}

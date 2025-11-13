import { useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNextRaces } from "../api/fetch-next-races";
import { calculateRaceTime } from "../lib/utils";
import { THRESHOLD } from "../constants";
import type { RaceSummary } from "../types";

/**
 * Hook to fetch next races api data based on category and target count
 */
export function useGetNextRaces() {
  const removedRaceIdsRef = useRef<Set<string>>(new Set());

  const queryResult = useQuery({
    queryKey: ["next-races"],
    queryFn: () => fetchNextRaces(),
    refetchInterval: 60000, // Refetch every 60 seconds to keep data fresh
    select: (res) => {
      // Filter out expired races (started more than 60 seconds ago)
      const activeRaces: RaceSummary[] = [];
      for (const raceId of res.data.next_to_go_ids) {
        const raceData = res.data.race_summaries[raceId];
        // Assumming race is always defined for ids in next_to_go_ids
        const { shouldRemove } = calculateRaceTime(
          raceData.advertised_start.seconds,
          THRESHOLD
        );
        if (!shouldRemove) {
          activeRaces.push(raceData);
        }
      }
      return activeRaces;
    },
  });

  /**
   * function to remove race from data by raceId
   * @param race - The race to remove
   */
  const removeExpiredRace = useCallback(
    ({ race_id }: RaceSummary) => {
      removedRaceIdsRef.current.add(race_id);
      queryResult.refetch();
    },
    [queryResult]
  );

  const filteredData = useMemo(() => {
    if (!queryResult.data) return [];
    return queryResult.data.filter(
      (race) => !removedRaceIdsRef.current.has(race.race_id)
    );
  }, [queryResult.data, removedRaceIdsRef]);

  return {
    ...queryResult,
    data: filteredData,
    removeExpiredRace,
  };
}

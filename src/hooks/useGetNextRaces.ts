import { useQuery } from "@tanstack/react-query";
import { fetchNextRaces } from "../api/fetch-next-races";
import { CATEGORY_IDS, type CategoryName } from "../constants";
import { calculateRaceTime } from "../lib/utils";

/**
 * Parameters for useGetNextRaces hook
 */
export interface UseGetNextRacesParams {
  /**
   *  Category name to filter by (optional), if not provided, no filtering is applied
   */
  categoryName?: CategoryName;
}

/**
 * Hook to fetch next races api data based on category and target count
 */
export function useGetNextRaces({ categoryName }: UseGetNextRacesParams = {}) {
  // const [fetchCount, setFetchCount] = useState(FETCH_BATCH_SIZE);
  const selectedCategoryId = categoryName
    ? CATEGORY_IDS[categoryName]
    : undefined;

  const queryResult = useQuery({
    queryKey: ["next-races"],
    queryFn: () => fetchNextRaces(),
    // refetchInterval: 10000, // Refetch every 10 seconds to get fresh races
    select: (res) => {
      // Extract races array from the response json
      const racesArray = Object.values(res.data.race_summaries);

      // Filter out expired races (started more than 60 seconds ago)
      const activeRaces = racesArray.filter((race) => {
        const { shouldRemove } = calculateRaceTime(race.advertised_start.seconds);
        return !shouldRemove;
      });

      // Filter by category if was provided
      return selectedCategoryId
        ? activeRaces.filter((race) => race.category_id === selectedCategoryId)
        : activeRaces;
    },
  });

  return {
    ...queryResult,
    data: queryResult.data ?? [],
  };
}

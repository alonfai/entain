import { useMemo, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetNextRaces } from "@/hooks/useGetNextRaces";
import { useGlobalTimer } from "@/hooks/useGlobalTimer";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import type { RaceSummary } from "@/types";
import { RaceTable } from "./RaceTable";
import { RaceTimer } from "./RaceTimer";

const LIMIT_RECORDS = 5;

export function Races() {
  const { data, isLoading, error, refetch, removeExpiredRace } = useGetNextRaces();
  
  // Single global timer for all races
  const currentTime = useGlobalTimer();

  // Memoized callback to prevent unnecessary re-renders
  const handleRaceExpired = useCallback((race: RaceSummary) => {
    removeExpiredRace(race);
  }, [removeExpiredRace]);

  const columns = useMemo<ColumnDef<RaceSummary>[]>(
    () => [
      {
        accessorKey: "category_id",
        header: "Category ID",
        filterFn: "equalsString",
      },
      {
        accessorKey: "meeting_name",
        header: "Location",
      },
      {
        accessorKey: "race_number",
        header: "Race Number",
      },
      {
        accessorKey: "advertised_start.seconds",
        header: "Time",
        cell: ({ row }) => (
          <RaceTimer 
            row={row.original} 
            currentTime={currentTime}
            onShouldRemove={handleRaceExpired} 
          />
        ),
      },
    ],
    [currentTime, handleRaceExpired]
  );

  /**
   * Sorting function: sort by advertised_start.seconds in ascending order
   */
  const sortFn = useMemo(
    () => (a: RaceSummary, b: RaceSummary) =>
      a.advertised_start.seconds - b.advertised_start.seconds,
    []
  );

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : String(error)}
        showRetry={true}
        onRetry={refetch}
      />
    );
  }

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: "var(--custom-text-primary)" }}
        >
          Next to Jump
        </h2>
        <p className="text-sm" style={{ color: "var(--custom-text-muted)" }}>
          Showing the next {LIMIT_RECORDS} upcoming races
        </p>
      </div>
      <RaceTable
        columns={columns}
        data={data}
        limit={LIMIT_RECORDS}
        sort={sortFn}
        emptyDataText="No upcoming races found"
      />
    </section>
  );
}

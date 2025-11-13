import { useEffect, useRef } from "react";
import { calculateRaceTime, cn } from "@/lib/utils";
import type { RaceSummary } from "@/types";
import { THRESHOLD } from "@/constants";

export interface RaceTimerProps {
  /** Race information */
  row: RaceSummary;
  /** Current time from global timer */
  currentTime: number;
  /** Optional callback when race should be removed (started > 1 minute ago) */
  onShouldRemove: (race: RaceSummary) => void;
}

export function RaceTimer({ row, currentTime, onShouldRemove }: RaceTimerProps) {
  const hasNotifiedRef = useRef(false);

  // Calculate race time using the global current time
  const result = calculateRaceTime(row.advertised_start.seconds, THRESHOLD, currentTime);

  // Handle race expiration (only notify once per race)
  useEffect(() => {
    if (result.shouldRemove && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onShouldRemove(row);
    }
  }, [result.shouldRemove, row, onShouldRemove]);

  // Reset notification flag if race is no longer expired (edge case)
  useEffect(() => {
    if (!result.shouldRemove && hasNotifiedRef.current) {
      hasNotifiedRef.current = false;
    }
  }, [result.shouldRemove]);

  // Determine the styling based on time remaining
  const isStartingSoon = result.timeDiff < 60 && result.timeDiff > 0; // Less than 1 minute
  const hasStarted = result.hasStarted;

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold transition-all",
        hasStarted && "bg-(--custom-error)",
        isStartingSoon && !hasStarted && "bg-(--custom-warning)",
        !isStartingSoon && !hasStarted && "bg-(--custom-success)",
      )}
      style={{
        color: hasStarted 
          ? 'var(--custom-error-text)' 
          : isStartingSoon 
            ? 'var(--custom-warning-text)' 
            : 'var(--custom-success-text)'
      }}
    >
      {result.timeString}
    </span>
  );
}

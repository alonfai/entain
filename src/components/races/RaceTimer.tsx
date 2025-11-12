import { useEffect, useRef, useState } from "react";
import { calculateRaceTime, cn } from "@/lib/utils";
import type { RaceSummary } from "@/types";

export interface RaceTimerProps {
  /** Race information */
  row: RaceSummary;
  /** Optional callback when race should be removed (started > 1 minute ago) */
  onTimeout?: () => void;
}

export function RaceTimer({ row, onTimeout }: RaceTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startTimeSeconds = row.advertised_start.seconds;
    const updateTimer = () => {
      const result = calculateRaceTime(startTimeSeconds);
      setTimeRemaining(result.timeString);

      // Notify parent if race should be removed
      if (result.shouldRemove && onTimeout) {
        clearInterval(intervalRef.current);
        onTimeout();
      }
    };

    // Update immediately
    updateTimer();

    // Update every second of the timer
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalRef.current);
  }, [row, onTimeout]);

  // Determine the styling based on time remaining
  const isStartingSoon =
    row.advertised_start.seconds * 1000 - Date.now() < 60000; // Less than 1 minute
  const hasStarted = row.advertised_start.seconds * 1000 < Date.now();

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold transition-all",
        hasStarted && "bg-(--custom-error)",
        isStartingSoon && !hasStarted && "bg-(--custom-warning)",
        !isStartingSoon && !hasStarted && "bg-(--custom-success)"
      )}
    >
      {timeRemaining}
    </span>
  );
}

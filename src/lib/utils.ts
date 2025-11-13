import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get current time in seconds (Unix timestamp)
 * Returns the global NOW_IN_SECONDS value for consistency across the app
 */
export function getCurrentTimeInSeconds() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Result from calculating race time
 */
export interface RaceTimeResult {
  /** Formatted time string to display */
  timeString: string;
  /** True if race started more than 1 minute ago and should be removed */
  shouldRemove: boolean;
  /** True if race has started (time is negative) */
  hasStarted: boolean;
  /** Raw time difference in seconds (positive = future, negative = past) */
  timeDiff: number;
}

/**
 * Calculate the time remaining or elapsed for a race
 * @param startTimeSeconds - Race start time in seconds (Unix timestamp)
 * @param thresholdSeconds - Threshold in seconds to determine removal (default: 60s)
 * @param currentTimeSeconds - Optional current time override (for global timer)
 * @returns RaceTimeResult with formatted string and removal flag
 */
export function calculateRaceTime(
  startTimeSeconds: number,
  thresholdSeconds: number,
  currentTimeSeconds?: number
): RaceTimeResult {
  const nowInSeconds = currentTimeSeconds ?? getCurrentTimeInSeconds();
  const timeDiff = startTimeSeconds - nowInSeconds;
  const hasStarted = timeDiff <= 0;

  // Check if race data should be removed (started more than 1 minute ago)
  const shouldRemove = hasStarted && Math.abs(timeDiff) >= thresholdSeconds;

  let timeString: string;

  if (hasStarted) {
    // Race has started, show elapsed time
    const elapsed = Math.abs(timeDiff);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timeString = `Started ${minutes}m ${seconds}s ago`;
  } else {
    // Race hasn't started, show countdown
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;
    timeString = `${minutes}m ${seconds}s To Start`;
  }

  return {
    timeString,
    shouldRemove,
    hasStarted,
    timeDiff,
  };
}

import { useState, useEffect, useRef } from "react";

/**
 * Global timer hook that updates all race timers synchronously
 * Prevents multiple intervals by using a single timer for all races
 */
export function useGlobalTimer() {
  const [currentTime, setCurrentTime] = useState(() => Math.floor(Date.now() / 1000));
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Update every second
    intervalRef.current = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return currentTime;
}

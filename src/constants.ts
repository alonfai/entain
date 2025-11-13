/**
 * List of available category IDs to filter by races0
 */
export const CATEGORY_IDS = {
  GREYHOUND: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
  HARNESS: "161d9be2-e909-4326-8c2c-35ed71fb460b",
  HORSE: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
} as const;

/**
 * Category names available for filtering
 */
export type CategoryName = keyof typeof CATEGORY_IDS;

/**
 * The threshold in seconds to determine when a race should be removed
 */
export const THRESHOLD = 60;

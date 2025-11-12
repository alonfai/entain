export interface AdvertisedStart {
  /** Time for the race to start in seconds */
  seconds: number;
}

export interface DistanceType {
  id: string;
  name: string;
  short_name: ShortName;
}

export interface Weather extends DistanceType {
  icon_uri: ICON_URL;
}

export interface RaceForm {
  distance: number;
  distance_type: DistanceType;
  distance_type_id: string;
  track_condition: DistanceType;
  track_condition_id: string;
  weather: Weather;
  weather_id: string;
  race_comment: string;
  additional_data: string;
  generated: number;
  silk_base_url: string;
  race_comment_alternative: string;
}

export type ShortName = "fine" | "good" | "m" | "ocast" | "showers" | "showery";

export type ICON_URL = "FINE" | "GOOD" | "M" | "OCAST" | "SHOWERS" | "SHOWERY";

export interface RaceSummary {
  race_id: string;
  race_name: string;
  race_number: number;
  meeting_id: string;
  meeting_name: string;
  category_id: string;
  advertised_start: AdvertisedStart;
  race_form: RaceForm;
  venue_id: string;
  venue_name: string;
  venue_state: string;
  venue_country: string;
  meeting_brands?: string[];
}

/**
 *  Response from the races endpoint
 */
export interface RacesResponse {
  status: string;
  data: {
    race_summaries: Record<string, RaceSummary>;
    next_to_go_ids: string[];
  };
  message: string;
}

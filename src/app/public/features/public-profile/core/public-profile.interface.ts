export interface UserInfo {
  featured: boolean;
  gender: string;
  id: string;
  location: UserLocation;
  micro_name: string;
  register_date: number;
  type: string;
  url_share: string;
  web_slug: string;
  isPro?: boolean;
  image: Image;
}

export interface UserStats {
  counters: UserCounter[];
  ratings: 'reviews';
}

export interface UserCounter {
  type: CounterTypes;
  value: number;
}

export interface UserLocation {
  approxRadius: number;
  approximated_latitude: number;
  approximated_location: boolean;
  approximated_longitude: number;
  city: string;
  zip: string;
}

export interface Image {
  id: string;
  legacy_id?: number;
  original_width: number;
  original_height: number;
  urls_by_size: {
    original: string;
    small: string;
    large: string;
    medium: string;
    xlarge: string;
    xsmall: string;
  };
}

export enum CounterTypes {
  'publish',
  'buys',
  'sells',
  'reviews',
  'sold',
  'reports_received',
}

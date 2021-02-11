import { ApiResponse } from '@core/resource/api-response.interface';

export interface ApiUserResponse extends ApiResponse {
  micro_name: string;
  image: ApiImage;
  location: ApiUserLocation;
  stats: ApiUserStatsOld;
  validations: ApiUserValidations;
  verification_level: number;
  scoring_stars: number;
  scoring_starts: number;
  response_rate: string;
  online: boolean;
  received_reports: number;
  type: string;
  web_slug: string;
  first_name?: string;
  last_name?: string;
  birth_date?: number;
  gender?: string;
  email?: string;
  featured?: boolean;
  extra_info?: ApiUserExtrainfo;
  url_share: string;
  register_date: number;
}

export interface ApiImage {
  id: string;
  legacy_id?: number;
  original_width: number;
  original_height: number;
  average_hex_color: string;
  urls_by_size: {
    original: string;
    small: string;
    large: string;
    medium: string;
    xlarge: string;
  };
}

export interface ApiUserLocation {
  approximated_latitude: number;
  approximated_longitude: number;
  city: string;
  zip: string;
  approxRadius: number;
  title?: string;
  full_address?: string;
  approximated_location?: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  country_code: string;
}

export interface ApiUserStatsOld {
  published: number;
  sold: number;
  favorites: number;
  send_reviews: number;
  received_reviews: number;
  notification_read_pending: number;
  purchased: number;
}

export interface ApiUserValidations {
  email: boolean;
  mobile: boolean;
  facebook: boolean;
  google_plus: boolean;
  gender: boolean;
  location: boolean;
  picture: boolean;
  scoring_stars: number;
  level: number;
  birthday: boolean;
}

export interface ApiUserExtrainfo {
  description: string;
  address?: string;
  phone_number: string;
  link: string;
  latitude?: number;
  longitude?: number;
  updatedLatitude: boolean;
  updatedLongitude: boolean;
  updatedAddress: boolean;
  updatedLink: boolean;
  updatedDescription: boolean;
  updatedPhoneNumber: boolean;
  updatedModifiedDate: boolean;
  updatedOpeningHours: boolean;
  updatedNewChatNotification: boolean;
  updatedOnlyChatPhoneNotification: boolean;
  updatedConsentThirdPartiesUseData: boolean;
  updatedNewsNotification: boolean;
  opening_hours: string;
  new_chat_notification: boolean;
  only_chat_phone_notification: boolean;
  consent_third_parties_use_data: boolean;
  news_notification: boolean;
  modified_date: number;
}

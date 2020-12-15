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
  image?: Image;
  extra_info?: UserExtrainfo;
}

export interface UserStats {
  counters: CounterTypes;
  ratings: Ratings;
}

export interface Ratings {
  reviews: number;
}

export interface UserLocation {
  id?: number;
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
  average_hex_color?: string;
  urls_by_size: {
    original: string;
    small: string;
    large: string;
    medium: string;
    xlarge: string;
    xmall: string;
  };
}

export interface CounterTypes {
  publish: number;
  buys: number;
  sells: number;
  reviews: number;
  sold: number;
  reports_received: number;
  favorites?: number;
  views?: number;
  profile_favorited_received?: number;
  profile_favorited?: number;
  onHold?: number;
}

export interface UserExtrainfo {
  description: string;
  address?: string;
  phone_number: string;
  link: string;
  latitude?: number;
  longitude?: number;
  consent_third_parties_use_data?: boolean;
  modified_date?: number;
  new_chat_notification?: boolean;
  news_notification?: boolean;
  only_chat_phone_notification?: boolean;
  opening_hours?: string;
  updatedAddress?: boolean;
  updatedConsentThirdPartiesUseData?: boolean;
  updatedDescription?: boolean;
  updatedLatitude?: boolean;
  updatedLink?: boolean;
  updatedLongitude?: boolean;
  updatedModifiedDate?: boolean;
  updatedNewChatNotification?: boolean;
  updatedNewsNotification?: boolean;
  updatedOnlyChatPhoneNotification?: boolean;
  updatedOpeningHours?: boolean;
  updatedPhoneNumber?: boolean;
}

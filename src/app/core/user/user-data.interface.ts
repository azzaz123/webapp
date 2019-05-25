export interface UserData {
  first_name?: string;
  last_name?: string;
  language_id?: string;
  birth_date?: string;
  gender?: string;
}

export interface UserProData {
  description?: string;
  opening_hours?: string;
  phone_number?: string;
  link?: string;
}

export interface UserProDataNotifications {
  new_chat_notification?: boolean;
  only_chat_phone_notification?: boolean;
  consent_third_parties_use_data?: boolean;
  news_notification?: boolean;
}

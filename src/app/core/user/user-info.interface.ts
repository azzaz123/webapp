export interface UserInfoResponse {
  scoring_stars: number;
  response_rate: string;
}

export interface UserProInfo {
  description: string;
  opening_hours: string;
  phone_number: string;
  new_chat_notification: boolean;
  only_chat_phone_notification: boolean;
  consent_third_parties_use_data: boolean;
  news_notification: boolean;
  link?: string;
}

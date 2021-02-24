export interface StatisticFullResponse {
  totals: StatisticTotalResponse;
  entries: StatisticEntriesResponse[];
}
export interface StatisticTotalResponse {
  phone_numbers: number;
  country_bump: number;
  views: number;
  city_bump: number;
  chats: number;
  sold: number;
}
export interface StatisticEntriesResponse {
  date: string;
  values: {
    phone_numbers: number;
    views: number;
    chats: number;
    city_bump: number;
    country_bump: number;
    sold: number;
  };
}

export interface StatisticFullResponse {
  totals: StatisticTotalResponse;
  entries: StatisticEntriesResponse[];
}
export interface StatisticTotalResponse {
  phone_numbers: string;
  views: string;
  chats: string;
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

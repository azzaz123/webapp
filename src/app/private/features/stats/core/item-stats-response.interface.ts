export interface ItemStatisticFullResponse {
  entries: ItemStatisticEntriesResponse[];
}

export interface ItemStatisticEntriesResponse {
  date: string;
  bumped?: boolean;
  values: {
    views: number;
    chats: number;
    favs: number;
  };
}

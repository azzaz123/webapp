import { SearchItem } from '@public/features/search/interfaces/search-item.interface';

export interface SearchResponse<T> {
  search_objects: T[];
  from: number;
  to: number;
  distance_ordered: boolean;
  search_point: {
    latitude: number,
    longitude: number
  };
}

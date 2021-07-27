import { SORT_BY } from '@api/core/model';

export interface SearchResponse<T = any> {
  search_objects: T[];
  from: number;
  to: number;
  distance_ordered: boolean;
  search_point: {
    latitude: number;
    longitude: number;
  };
  order: SORT_BY;
  bubble?: string;
}

import { SORT_BY } from '@public/features/search/components/sort-filter/services/constants/sort-by-options-constants';

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
}

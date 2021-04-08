import { ItemResponse } from '@core/item/item-response.interface';

export interface SearchResponse {
  from: number;
  to: number;
  distance_ordered: boolean;
  search_point: {
    latitude: number;
    longitude: number;
  };
  search_objects: ItemResponse;
}


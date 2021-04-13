export interface SearchResponse<T = any> {
  search_objects: T[];
  from: number;
  to: number;
  distance_ordered: boolean;
  search_point: {
    latitude: number,
    longitude: number
  };
}

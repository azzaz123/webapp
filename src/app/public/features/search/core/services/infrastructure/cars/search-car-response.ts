import { SearchBaseItemResponse } from '../models/search-base-item.response';

export interface SearchItemCarResponse extends SearchBaseItemResponse {
  brand: string;
  model: string;
  year: number;
  version: string;
  km: number;
  engine: string;
  gearbox: string;
  horsepower: number;
  storytelling: string;
}

export interface SearchCarResponse {
  id: string;
  type: string;
  content: SearchItemCarResponse;
}



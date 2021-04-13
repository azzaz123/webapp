import { SearchBaseItemResponse } from '../models/search-base-item.response';

export interface SearchItemRealStateResponse extends SearchBaseItemResponse {
    operation: string;
    type: string;
    surface: number;
    rooms: number;
    bathrooms: number;
    garage: boolean;
    terrace: boolean;
    elevator: boolean;
    pool: boolean;
    garden: boolean;
    condition: string;
    storytelling: string;
}

export interface SearchRealStateResponse {
  id: string;
  title: string;
  content: SearchItemRealStateResponse;
}


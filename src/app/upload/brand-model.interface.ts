export interface Brand {
  brand: string;
}

export interface Model {
  model: string;
}

export interface BrandModel {
  brand: string;
  model: string;
}

export interface Size {
  id: number;
  text: string;
}

export interface SizesResponse {
  male: Size[];
  female: Size[];
}

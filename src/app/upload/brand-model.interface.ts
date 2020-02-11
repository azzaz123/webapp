export interface ObjectType {
  id: string;
  name: string;
}

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
  id: string;
  text: string;
}

export interface SizesResponse {
  male: Size[];
  female: Size[];
}

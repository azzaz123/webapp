export interface AddressResponse {
  html_attributions: Array<string>;
  result: AddressResult;
  status: string;
}

export interface AddressResult {
  address_components: Array<AddressComponent>;
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  id: string;
  name: string;
  photos: Array<Photo>;
  place_id: string;
  reference: string;
  scope: string;
  types: Array<string>;
  url: string;
  utc_offset: number;
  vicinity: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: Array<string>;
}

export interface Geometry {
  location: Coordinate;
  viewport: Positioning;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
  name?: string;
  approximated_location?: boolean;
}

export interface StoreLocationResponse {
  check_change_location: boolean;
}

export interface StoreLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ItemLocation {
  latitude: number;
  longitude: number;
  address: string;
  approximated_location: boolean;
}

export interface Positioning {
  northeast: Coordinate;
  southwest: Coordinate;
}

export interface Photo {
  height: number;
  html_attributions: Array<string>;
  photo_reference: string;
  width: number;
}

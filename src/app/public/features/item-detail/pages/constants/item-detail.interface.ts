import { Coordinate } from '@core/geolocation/address-response.interface';

export interface ItemDetailLocation extends Coordinate {
  city: string;
  zip: string;
}

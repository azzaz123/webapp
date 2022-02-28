import { Location } from '@api/core/model/location/location';

export interface CarrierOfficeInfo extends Location {
  id: string;
  carrier: string;
  city: string;
  country: string;
  name: string;
  openingHours: string[];
  postalCode: string;
  street: string;
}

export interface CarrierOfficeSchedule {
  openingHours: string[];
  name: string;
}

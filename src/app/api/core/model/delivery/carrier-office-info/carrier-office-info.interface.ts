import { Location } from '@api/core/model/location/location';

export interface CarrierOfficeInfo extends Location, CarrierOfficeSchedule {
  id: string;
  carrier: string;
  city: string;
  country: string;
  postalCode: string;
  street: string;
}

export interface CarrierOfficeSchedule {
  openingHours: string[];
  name: string;
}

import { PayviewCountryIsoCode } from '@private/features/payview/enums/payview-country-iso-code.enum';

export interface PayviewDeliveryAddress {
  city: string;
  countryIsoCode: PayviewCountryIsoCode;
  flatAndFloor?: string;
  fullName: string;
  id: string;
  phoneNumber: string;
  postalCode: string;
  region: string;
  street: string;
}

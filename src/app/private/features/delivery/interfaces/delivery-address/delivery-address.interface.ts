export interface DeliveryAddress {
  id: string;
  fullName: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  countryIsoCode: string;
  phoneNumber: string;
  flatAndFloor?: string;
}

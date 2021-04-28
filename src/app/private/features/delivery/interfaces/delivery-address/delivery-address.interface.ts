export interface DeliveryAddress {
  id?: string;
  fullName: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  phoneNumber: string;
  flatAndFloor?: string;
}

export interface DeliveryAddressApiModel {
  id?: string;
  full_name: string;
  street: string;
  postal_code: string;
  city: string;
  region: string;
  country: string;
  phone_number: string;
  flat_and_floor?: string;
}

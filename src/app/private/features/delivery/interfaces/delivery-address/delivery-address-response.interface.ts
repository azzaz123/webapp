export interface DeliveryAddressResponse {
  id: string;
  full_name: string;
  street: string;
  postal_code: string;
  city: string;
  region: string;
  country: string;
  phone_number: string;
  flat_and_floor?: string;
}

export type CarrierDto = 'SEUR' | 'POSTE_ITALIANE' | 'correos';

export interface CarrierOfficeAddressesDto {
  offices: CarrierOfficeInfoDto[];
}

export interface CarrierOfficeInfoDto {
  carrier: CarrierDto;
  carrier_office_id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  name?: string;
  opening_hours: string[];
  postal_code: string;
  street: string;
}

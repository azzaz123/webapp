import { CarrierDto } from '@api/delivery/carrier-drop-off-mode/request/dtos/carrier-drop-off-mode-request-dto.interface';

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

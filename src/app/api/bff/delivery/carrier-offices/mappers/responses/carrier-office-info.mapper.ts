import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { CarrierOfficeAddressesDto, CarrierOfficeInfoDto } from '../../dtos/responses/carrier-office-addresses-dto.interface';

export const mapCarrierOfficeAddressesDtoToCarrierOfficeInfo: ToDomainMapper<CarrierOfficeAddressesDto, CarrierOfficeInfo[]> = (
  input: CarrierOfficeAddressesDto
): CarrierOfficeInfo[] => {
  const carriersMapped: CarrierOfficeInfo[] = input.offices.map(mapOfficeAddress);

  return carriersMapped;
};

const mapOfficeAddress: ToDomainMapper<CarrierOfficeInfoDto, CarrierOfficeInfo> = (
  officeInfoDto: CarrierOfficeInfoDto
): CarrierOfficeInfo => {
  return {
    id: officeInfoDto.carrier_office_id,
    name: officeInfoDto.name,
    carrier: officeInfoDto.carrier,
    city: officeInfoDto.city,
    street: officeInfoDto.street,
    postalCode: officeInfoDto.postal_code,
    country: officeInfoDto.country,
    latitude: officeInfoDto.latitude,
    longitude: officeInfoDto.longitude,
    openingHours: officeInfoDto.opening_hours,
  };
};

import {
  CarrierOfficeAdressesDto,
  CarrierOfficeInfoDto,
} from '@api/bff/delivery/carrier-offices/dtos/responses/carrier-office-adresses-dto.interface';

export const MOCK_CARRIER_OFFICE_INFO_DTO: CarrierOfficeInfoDto = {
  carrier: 'correos',
  carrier_office_id: '82378',
  city: 'Madrid',
  country: 'Spain',
  latitude: 2.0,
  longitude: 48.0,
  name: 'office name',
  opening_hours: ['Week days : 10am to 7pm', 'Week-end : 8am to 10pm'],
  postal_code: '08027',
  street: 'C/ Sol Abcd',
};

export const MOCK_CARRIER_OFFICE_INFO_2_DTO: CarrierOfficeInfoDto = {
  carrier: 'SEUR',
  carrier_office_id: 'office ID',
  city: 'Bordeaux',
  country: 'France',
  latitude: 22324.0,
  longitude: 5454534.0,
  opening_hours: ['Week days : 9am to 4pm', 'Week-end : 1am to 2pm'],
  postal_code: '347364',
  street: 'Andsuhid',
};

export const MOCK_CARRIER_OFFICES_ADDRESSES_DTO: CarrierOfficeAdressesDto = {
  offices: [MOCK_CARRIER_OFFICE_INFO_DTO, MOCK_CARRIER_OFFICE_INFO_2_DTO],
};

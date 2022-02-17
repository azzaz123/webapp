import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';

const MOCK_CARRIER_OFFICE_INFO: CarrierOfficeInfo = {
  carrier: 'correos',
  id: '82378',
  city: 'Madrid',
  country: 'Spain',
  latitude: 2.0,
  longitude: 48.0,
  name: 'office name',
  openingHours: ['Week days : 10am to 7pm', 'Week-end : 8am to 10pm'],
  postalCode: '08027',
  street: 'C/ Sol Abcd',
};

const MOCK_CARRIER_OFFICE_INFO_2: CarrierOfficeInfo = {
  carrier: 'SEUR',
  id: 'office ID',
  name: null,
  city: 'Bordeaux',
  country: 'France',
  latitude: 22324.0,
  longitude: 5454534.0,
  openingHours: ['Week days : 9am to 4pm', 'Week-end : 1am to 2pm'],
  postalCode: '347364',
  street: 'Andsuhid',
};

export const MOCK_CARRIERS_OFFICE_INFO: CarrierOfficeInfo[] = [MOCK_CARRIER_OFFICE_INFO, MOCK_CARRIER_OFFICE_INFO_2];

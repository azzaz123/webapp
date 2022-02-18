import { SelectedCarrierOfficeDto } from '@api/delivery/me/carrier-office-addresses/dtos/requests/selected-carrier-office-dto.interface';

export const MOCK_SELECTED_CARRIER_OFFICE_DTO: SelectedCarrierOfficeDto = {
  id: '8wbdusdnws',
  city: 'Madrid',
  postal_code: '08027',
  country: 'Spain',
  street: 'C/ Sol Abcd',
  name: 'office name',
  carrier_office_id: '82378',
  carrier: 'correos',
};

export const MOCK_SELECTED_CARRIER_OFFICE_DTO_2: SelectedCarrierOfficeDto = {
  id: '2837sdbs',
  city: 'Bordeaux',
  postal_code: '347364',
  country: 'France',
  street: 'Andsuhid',
  name: null,
  carrier_office_id: 'office ID',
  carrier: 'SEUR',
};

import { ToDomainMapper } from '@api/core/utils/types';
import { SelectedCarrierOfficeDto } from '../../dtos/requests/selected-carrier-office-dto.interface';
import { SelectedCarrierOffice } from '@api/core/model/delivery/selected-carrier-office/selected-carrier-office.interface';

export const mapSelectedCarrierOfficeToSelectedCarrierOfficeDto: ToDomainMapper<SelectedCarrierOffice, SelectedCarrierOfficeDto> = (
  input: SelectedCarrierOffice
) => {
  const { id, city, postalCode: postal_code, country, street, name, carrierOfficeId: carrier_office_id, carrier } = input;

  return {
    id,
    city,
    postal_code,
    country,
    street,
    name: name || null,
    carrier_office_id,
    carrier,
  };
};

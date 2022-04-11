import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { SelectedCarrierOfficeDto } from '../../dtos/requests/selected-carrier-office-dto.interface';

export function mapCarrierOfficeInfoToSelectedCarrierOfficeDto(
  userCarrierOfficeId: string,
  input: CarrierOfficeInfo
): SelectedCarrierOfficeDto {
  const { city, postalCode: postal_code, country, street, name, id: carrier_office_id, carrier } = input;

  return {
    id: userCarrierOfficeId,
    city,
    postal_code,
    country,
    street,
    name: name || null,
    carrier_office_id,
    carrier,
  };
}

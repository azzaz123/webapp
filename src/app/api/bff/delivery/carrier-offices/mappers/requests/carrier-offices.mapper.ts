import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { CarrierDto } from '@api/bff/delivery/carrier-offices/dtos/responses/carrier-office-addresses-dto.interface';

export const mapCarrierDomainToDto: Record<POST_OFFICE_CARRIER, CarrierDto> = {
  [POST_OFFICE_CARRIER.SEUR]: 'SEUR',
  [POST_OFFICE_CARRIER.POSTE_ITALIANE]: 'POSTE_ITALIANE',
  [POST_OFFICE_CARRIER.CORREOS]: 'correos',
};

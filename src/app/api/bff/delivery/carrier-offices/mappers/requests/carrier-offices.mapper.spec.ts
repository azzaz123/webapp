import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { mapCarrierDomainToDto } from './carrier-offices.mapper';

describe('mapCarrierDomainToDto', () => {
  describe('when converting carrier to dto', () => {
    it('should map to dto context', () => {
      expect(mapCarrierDomainToDto[POST_OFFICE_CARRIER.SEUR]).toEqual('SEUR');
      expect(mapCarrierDomainToDto[POST_OFFICE_CARRIER.POSTE_ITALIANE]).toEqual('POSTE_ITALIANE');
      expect(mapCarrierDomainToDto[POST_OFFICE_CARRIER.CORREOS]).toEqual('correos');
    });
  });
});

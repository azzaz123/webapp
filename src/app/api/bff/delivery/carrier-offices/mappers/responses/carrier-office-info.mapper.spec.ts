import { MOCK_CARRIER_OFFICES_ADDRESSES_DTO } from '@api/fixtures/delivery/carrier-offices/carrier-offices-dto.fixtures.spec';
import { MOCK_CARRIERS_OFFICE_INFO } from '@fixtures/private/delivery/carrier-office-info/carrier-office-info.fixtures.spec';
import { mapCarrierOfficeAddressesDtoToCarrierOfficeInfo } from './carrier-office-info.mapper';

describe('mapCarrierOfficeAddressesDtoToCarrierOfficeInfo', () => {
  describe('when mapping from office addresses DTO', () => {
    it('should map to a carrier office info entity ', () => {
      const result = mapCarrierOfficeAddressesDtoToCarrierOfficeInfo(MOCK_CARRIER_OFFICES_ADDRESSES_DTO);

      expect(result).toMatchObject(MOCK_CARRIERS_OFFICE_INFO);
    });
  });
});

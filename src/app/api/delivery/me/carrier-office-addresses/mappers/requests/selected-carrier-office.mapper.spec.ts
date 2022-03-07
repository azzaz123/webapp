import { MOCK_SELECTED_CARRIER_OFFICE_DTO } from '@api/fixtures/delivery/carrier-office-addresses/selected-carrier-office-dto.fixtures.spec';
import { MOCK_CARRIER_OFFICE_INFO } from '@fixtures/private/delivery/carrier-office-info/carrier-office-info.fixtures.spec';
import { SelectedCarrierOfficeDto } from '../../dtos/requests/selected-carrier-office-dto.interface';
import { mapCarrierOfficeInfoToSelectedCarrierOfficeDto } from './selected-carrier-office.mapper';

describe('mapCarrierOfficeInfoToSelectedCarrierOfficeDto', () => {
  describe('when converting carrier office info to dto model', () => {
    it('should map to dto context', () => {
      const MOCK_UUID: string = '8wbdusdnws';
      let result: SelectedCarrierOfficeDto;

      result = mapCarrierOfficeInfoToSelectedCarrierOfficeDto(MOCK_UUID, MOCK_CARRIER_OFFICE_INFO);

      expect(result).toEqual(MOCK_SELECTED_CARRIER_OFFICE_DTO);
    });
  });
});

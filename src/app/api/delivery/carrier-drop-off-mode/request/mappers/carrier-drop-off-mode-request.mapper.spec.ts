import { CarrierDropOffModeRequest } from '@api/core/model/delivery/carrier-drop-off-mode/carrier-drop-off-mode-request.interface';
import { MOCK_CARRIER_DROP_OFF_MODE_REQUEST_DTO } from '@api/fixtures/delivery/carrier-drop-off-mode/carrier-drop-off-mode-request-dto.fixtures';
import { MOCK_CARRIER_DROP_OFF_MODE_REQUEST } from '@fixtures/private/delivery/accept-screen/carrier-drop-off-mode-request.fixtures.spec';
import { mapCarrierDropOffRequestModeDtoToCarrierDropOffModeRequest } from './carrier-drop-off-mode-request.mapper';

describe('mapCarrierDropOffRequestModeDtoToCarrierDropOffModeRequest', () => {
  describe('when converting carrier drop off request mode to web context', () => {
    it('should map to web context', () => {
      let result: CarrierDropOffModeRequest;

      result = mapCarrierDropOffRequestModeDtoToCarrierDropOffModeRequest(MOCK_CARRIER_DROP_OFF_MODE_REQUEST_DTO);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(MOCK_CARRIER_DROP_OFF_MODE_REQUEST));
    });
  });
});

import { MOCK_PAYMENTS_CLIENT_BROWSER_INFO } from '@api/fixtures/core/model/payments/payments-client-browser-info.fixtures.spec';
import { MOCK_PAYMENTS_CLIENT_BROWSER_INFO_DTO } from '@api/fixtures/payments/users/client-browser-info/payments-client-browser-info.fixtures.spec';
import { mapPaymentsClientBrowserInfoToDto } from './payments-client-browser-info.mapper';

describe('mapPaymentsClientBrowserInfoToDto', () => {
  describe('when transforming payments client browser info to server context', () => {
    it('should transform the data', () => {
      const result = mapPaymentsClientBrowserInfoToDto(MOCK_PAYMENTS_CLIENT_BROWSER_INFO);

      expect(result).toEqual(MOCK_PAYMENTS_CLIENT_BROWSER_INFO_DTO);
    });
  });
});

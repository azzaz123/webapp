import { mapTransactionTrackingDetailsDtoTransactionTrackingDetails } from '@api/bff/delivery/transaction-tracking/mappers/responses/details/transaction-tracking-details.mapper';
import { MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE } from '@api/fixtures/bff/delivery';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';

describe('GIVEN mapTransactionTrackingDetailsDtoTransactionTrackingDetails', () => {
  describe('WHEN there is a TransactionTrackingDetailsDto', () => {
    it('should map to TransactionTrackingDetails', () => {
      const expected = MOCK_TRANSACTION_TRACKING_DETAILS;

      const response = mapTransactionTrackingDetailsDtoTransactionTrackingDetails(MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE);

      expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
    });
  });

  describe('WHEN there is no TransactionTrackingDto', () => {
    it('should map to empty TransactionTracking', () => {
      const expected = {};

      const response = mapTransactionTrackingDetailsDtoTransactionTrackingDetails(null);

      expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
    });
  });
});

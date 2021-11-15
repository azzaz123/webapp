import { mapTransactionTrackingDtoTransactionTracking } from './transaction-tracking.mapper';
import {
  MOCK_TRANSACTION_TRACKING,
  MOCK_TRANSACTION_TRACKING_WITH_ANALYTICS,
  MOCK_TRANSACTION_TRACKING_WITH_SUCCESS,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import {
  MOCK_TRANSACTION_TRACKING_DTO_RESPONSE,
  MOCK_TRANSACTION_TRACKING_WITH_ANALYTICS_DTO_RESPONSE,
  MOCK_TRANSACTION_TRACKING_WITH_SUCCESS_DTO_RESPONSE,
} from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-dto.fixtures.spec';

describe('GIVEN mapTransactionTrackingDtoTransactionTracking', () => {
  describe('WHEN there is a TransactionTrackingDto without analytics', () => {
    it('should map to TransactionTracking', () => {
      const expected = MOCK_TRANSACTION_TRACKING;

      const response = mapTransactionTrackingDtoTransactionTracking(MOCK_TRANSACTION_TRACKING_DTO_RESPONSE);

      expect(response).toEqual(expected);
    });
  });

  describe('WHEN there is a TransactionTrackingDto with analytics', () => {
    it('should map to TransactionTracking', () => {
      const expected = MOCK_TRANSACTION_TRACKING_WITH_ANALYTICS;

      const response = mapTransactionTrackingDtoTransactionTracking(MOCK_TRANSACTION_TRACKING_WITH_ANALYTICS_DTO_RESPONSE);

      expect(response).toEqual(expected);
    });
  });

  describe('WHEN there is a TransactionTrackingDto with success', () => {
    it('should map to TransactionTracking', () => {
      const expected = MOCK_TRANSACTION_TRACKING_WITH_SUCCESS;

      const response = mapTransactionTrackingDtoTransactionTracking(MOCK_TRANSACTION_TRACKING_WITH_SUCCESS_DTO_RESPONSE);

      expect(response).toEqual(expected);
    });
  });

  describe('WHEN there is no TransactionTrackingDto', () => {
    it('should map to empty TransactionTracking', () => {
      const expected = {};

      const response = mapTransactionTrackingDtoTransactionTracking(null);

      expect(response).toEqual(expected);
    });
  });
});

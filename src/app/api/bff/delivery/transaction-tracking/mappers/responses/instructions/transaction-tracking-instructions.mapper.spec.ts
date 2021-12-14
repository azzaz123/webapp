import { mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions } from '@api/bff/delivery/transaction-tracking/mappers/responses/instructions/transaction-tracking-instructions.mapper';
import {
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE,
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITH_EXTRA_INFO_DTO_RESPONSE,
} from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-instructions-dto.fixtures.spec';
import {
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS,
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITH_ADDITIONAL_INFO,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-instructions.fixtures.spec';

describe('GIVEN mapTransactionTrackingDetailsDtoTransactionTrackingDetails', () => {
  describe('WHEN there is a TransactionTrackingDetailsDto without extra info', () => {
    it('should map to TransactionTrackingDetails', () => {
      const expected = MOCK_TRANSACTION_TRACKING_INSTRUCTIONS;

      const response = mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions(
        MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE
      );

      expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
    });
  });

  describe('WHEN there is a TransactionTrackingDetailsDto with extra info', () => {
    it('should map to TransactionTrackingDetails', () => {
      const expected = MOCK_TRANSACTION_TRACKING_INSTRUCTIONS;

      const response = mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions(
        MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE
      );

      expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
    });
  });

  describe('WHEN there is no TransactionTrackingDto', () => {
    it('should map to empty TransactionTracking', () => {
      const expected = {};

      const response = mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions(null);

      expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
    });
  });
});

import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { mapTransactionsTrackingInfo, mapTransactionTrackingInfo } from './transaction-tracking-info.mapper';

const MOCK_STATUS_INFO = MOCK_TRANSACTION_TRACKING.statusInfo[0];
const MOCK_STATUS_INFO_MAPPED = {
  description: MOCK_STATUS_INFO.description,
  iconSrc: MOCK_STATUS_INFO.icon.url,
  showCaret: MOCK_STATUS_INFO.showCaret,
  iconClassName: MOCK_STATUS_INFO.icon.style.className,
};

describe('Transaction tracking info mapper', () => {
  describe('when mapping from one status info model to transaction tracking info', () => {
    it('should map to status info model', () => {
      const mappedItem = mapTransactionTrackingInfo(MOCK_STATUS_INFO);
      expect(mappedItem).toEqual(MOCK_STATUS_INFO_MAPPED);
    });
  });

  describe('when mapping from multiple status info model to transaction tracking info', () => {
    it('should map to status info model', () => {
      const mappedItem = mapTransactionsTrackingInfo([MOCK_STATUS_INFO, MOCK_STATUS_INFO]);
      expect(mappedItem).toEqual([MOCK_STATUS_INFO_MAPPED, MOCK_STATUS_INFO_MAPPED]);
    });
  });
});

import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { mapTransactionsDetail, mapTransactionDetail, FALLBACK_NOT_FOUND_SRC } from './transaction-detail.mapper';

const MOCK_STATUS_INFO = MOCK_TRANSACTION_TRACKING.statusInfo[0];
const MOCK_TRANSACTION_TRACKING_STATUS_INFO_WITHOUT_ICON = {
  ...MOCK_STATUS_INFO,
  icon: {
    url: null,
    thumbnailUrl: null,
    style: { className: null },
  },
};

const MOCK_STATUS_INFO_MAPPED = {
  description: MOCK_STATUS_INFO.description,
  iconSrc: MOCK_STATUS_INFO.icon.url,
  showCaret: MOCK_STATUS_INFO.showCaret,
  iconClassName: MOCK_STATUS_INFO.icon.style.className,
};
const MOCK_STATUS_INFO_WITH_FALLBACK_ICON_MAPPED = { ...MOCK_STATUS_INFO_MAPPED, iconSrc: FALLBACK_NOT_FOUND_SRC };

describe('Transaction detail mapper', () => {
  describe('when mapping from one status info model to transaction detail', () => {
    describe('and the info does NOT come with icon url', () => {
      it('should map to detail model with fallback icon', () => {
        const mappedItem = mapTransactionDetail(MOCK_TRANSACTION_TRACKING_STATUS_INFO_WITHOUT_ICON);
        expect(mappedItem).toEqual(MOCK_STATUS_INFO_WITH_FALLBACK_ICON_MAPPED);
      });
    });

    describe('and the info come with icon url', () => {
      it('should map to detail model', () => {
        const mappedItem = mapTransactionDetail(MOCK_STATUS_INFO);
        expect(mappedItem).toEqual(MOCK_STATUS_INFO_MAPPED);
      });
    });
  });

  describe('when mapping from multiple status info model to transaction detail', () => {
    it('should map to detail model', () => {
      const mappedItem = mapTransactionsDetail([MOCK_STATUS_INFO, MOCK_STATUS_INFO]);
      expect(mappedItem).toEqual([MOCK_STATUS_INFO_MAPPED, MOCK_STATUS_INFO_MAPPED]);
    });
  });
});

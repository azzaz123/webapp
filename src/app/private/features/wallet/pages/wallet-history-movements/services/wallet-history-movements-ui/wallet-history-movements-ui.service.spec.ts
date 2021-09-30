import { TestBed } from '@angular/core/testing';
import { WalletMovementHistoryDetail } from '@api/core/model/wallet/history/movement-history-detail';
import { MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS } from '@api/fixtures/core/model/wallet/history/movement-history-detail.fixtures.spec';
import { WalletMovementsHistory } from '../../interfaces/wallet-movements-history.interface';

import { WalletHistoryMovementsUIService } from './wallet-history-movements-ui.service';

const MOCK_WALLET_MOVEMENTS_HISTORY: WalletMovementsHistory = {
  years: [
    {
      value: 2021,
      title: '2021',
      elements: [
        {
          value: 8,
          title: 'September',
          elements: MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS,
        },
      ],
    },
  ],
};

describe('WalletHistoryMovementsUIService', () => {
  let service: WalletHistoryMovementsUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [WalletHistoryMovementsUIService] });
    service = TestBed.inject(WalletHistoryMovementsUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when converting data from model into UI model', () => {
    it('should map to UI model', () => {
      const inputModel: WalletMovementHistoryDetail[] = MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS;
      const expectedOutputModel: WalletMovementsHistory = MOCK_WALLET_MOVEMENTS_HISTORY;
      let result: WalletMovementsHistory;

      result = service.map(inputModel);

      expect(result).toEqual(expectedOutputModel);
    });
  });
});

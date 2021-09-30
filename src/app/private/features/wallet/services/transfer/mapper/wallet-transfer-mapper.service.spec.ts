import { TestBed } from '@angular/core/testing';

import { MOCK_MONEY_TO_TRANSFER } from '@fixtures/private/wallet/transfer/wallet-transfer.fixtures.spec';
import { WalletTransferMapperService } from '@private/features/wallet/services/transfer/mapper/wallet-transfer-mapper.service';

describe('WalletTransferMapperService', () => {
  let service: WalletTransferMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WalletTransferMapperService],
    });
    service = TestBed.inject(WalletTransferMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN we have a money object', () => {
    it('should map it to what the api requests', () => {
      const walletTransferRequest = service.mapToRequest(MOCK_MONEY_TO_TRANSFER);
      const expectedFunds = {
        amount: MOCK_MONEY_TO_TRANSFER.amount.total,
        currency: MOCK_MONEY_TO_TRANSFER.currency.code,
      };

      expect(walletTransferRequest.funds).toEqual(expectedFunds);
    });
  });
});

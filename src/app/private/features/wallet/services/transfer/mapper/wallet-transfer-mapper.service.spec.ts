import { TestBed } from '@angular/core/testing';

import { MOCK_MONEY_TO_TRANSFER } from '@fixtures/private/wallet/transfer/wallet-transfer.fixtures.spec';
import { WalletTransferMapperService } from '@private/features/wallet/services/transfer/mapper/wallet-transfer-mapper.service';

describe('WalletTransferMapperService', () => {
  let service: WalletTransferMapperService;
  const uuidRegex: RegExp = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

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
    it('should map the money to what the api requests', () => {
      const walletTransferRequest = service.mapToRequest(MOCK_MONEY_TO_TRANSFER);
      const expectedFunds = {
        amount: MOCK_MONEY_TO_TRANSFER.amount.total,
        currency: MOCK_MONEY_TO_TRANSFER.currency.code,
      };

      expect(walletTransferRequest.funds).toEqual(expectedFunds);
    });

    it('should map the id to a valid UUID', () => {
      const walletTransferRequest = service.mapToRequest(MOCK_MONEY_TO_TRANSFER);
      const expectedFunds = {
        amount: MOCK_MONEY_TO_TRANSFER.amount.total,
        currency: MOCK_MONEY_TO_TRANSFER.currency.code,
      };

      expect(uuidRegex.test(walletTransferRequest.id)).toBe(true);
    });

    it('should map the pay out id to a valid UUID', () => {
      const walletTransferRequest = service.mapToRequest(MOCK_MONEY_TO_TRANSFER);
      const expectedFunds = {
        amount: MOCK_MONEY_TO_TRANSFER.amount.total,
        currency: MOCK_MONEY_TO_TRANSFER.currency.code,
      };

      expect(uuidRegex.test(walletTransferRequest.pay_out_id)).toBe(true);
    });
  });
});

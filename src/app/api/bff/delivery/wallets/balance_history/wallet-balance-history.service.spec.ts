import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE } from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { of } from 'rxjs';
import { WalletBalanceHistoryHttpService } from './http/wallet-balance-history-http.service';
import { mapWalletHistoryFiltersToApi } from './mappers/requests/wallet-balance-history-filter.mapper';
import { mapWalletBalanceHistoryApiToWalletMovements } from './mappers/responses/wallet-balance-history.mapper';
import { WalletBalanceHistoryService } from './wallet-balance-history.service';

jest.mock('./mappers/requests/wallet-balance-history-filter.mapper');
jest.mock('./mappers/responses/wallet-balance-history.mapper');

describe('WalletBalanceHistoryService', () => {
  let service: WalletBalanceHistoryService;
  let walletBalanceHistoryHttpService: WalletBalanceHistoryHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletBalanceHistoryService, WalletBalanceHistoryHttpService],
    });
    service = TestBed.inject(WalletBalanceHistoryService);
    walletBalanceHistoryHttpService = TestBed.inject(WalletBalanceHistoryHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get Wallet history balance', () => {
    beforeEach(() => {
      spyOn(walletBalanceHistoryHttpService, 'get').and.returnValue(of(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE));
      service.get().subscribe();
    });

    it('should get the Wallet history movements', () => {
      expect(walletBalanceHistoryHttpService.get).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      expect(mapWalletBalanceHistoryApiToWalletMovements).toHaveBeenCalled();
    });

    it('should map web request to server context', () => {
      expect(mapWalletHistoryFiltersToApi).toHaveBeenCalled();
    });
  });
});

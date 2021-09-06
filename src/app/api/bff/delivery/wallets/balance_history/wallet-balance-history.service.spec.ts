import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Money } from '@api/core/model/money.interface';
import {
  MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE,
  MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY,
} from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { of } from 'rxjs';
import { WalletBalanceHistoryHttpService } from './http/wallet-balance-history-http.service';
import { WalletBalanceHistoryService } from './wallet-balance-history.service';

describe('WalletBalanceHistoryService', () => {
  let service: WalletBalanceHistoryService;
  let walletBalanceHistoryHttpService: WalletBalanceHistoryHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletBalanceHistoryService],
    });
    service = TestBed.inject(WalletBalanceHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get Wallet history balance', () => {
    beforeEach(() => {
      spyOn(walletBalanceHistoryHttpService, 'get').and.returnValue(of(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE));
    });

    it('should get the Wallet history movements', () => {
      service.get().subscribe();

      expect(walletBalanceHistoryHttpService.get).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      let response: Money;

      service.get().subscribe((data) => (response = data));

      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY));
    });
  });
});

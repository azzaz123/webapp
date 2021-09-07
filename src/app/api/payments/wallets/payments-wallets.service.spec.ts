import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Money } from '@api/core/model/money.interface';
import {
  MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY,
  MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE,
} from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { of } from 'rxjs';
import { PaymentsWalletsHttpService } from './http/payments-wallets-http.service';
import { PaymentsWalletsService } from './payments-wallets.service';

describe('PaymentsWalletsService', () => {
  let service: PaymentsWalletsService;
  let paymentsWalletsHttpService: PaymentsWalletsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsWalletsService, PaymentsWalletsHttpService],
    });
    service = TestBed.inject(PaymentsWalletsService);
    paymentsWalletsHttpService = TestBed.inject(PaymentsWalletsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get Wallet balance', () => {
    beforeEach(() => {
      spyOn(paymentsWalletsHttpService, 'get').and.returnValue(of(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE));
    });

    it('should get the Wallet balance', () => {
      service.walletBalance$.subscribe();

      expect(paymentsWalletsHttpService.get).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      let response: Money;

      service.walletBalance$.subscribe((data) => (response = data));

      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY));
    });
  });
});

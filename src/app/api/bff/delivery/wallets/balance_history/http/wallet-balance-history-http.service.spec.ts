import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_WALLET_BALANCE_HISTORY_API } from '@api/fixtures/bff/delivery/wallets/balance_history/wallet-balance-history.fixtures.spec';
import { WalletBalanceHistoryApi } from '../dtos/responses';
import { WALLET_BALANCE_HISTORY_ENDPOINT } from './endpoints';
import { WalletBalanceHistoryHttpService } from './wallet-balance-history-http.service';

describe('WalletBalanceHistoryHttpService', () => {
  let service: WalletBalanceHistoryHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletBalanceHistoryHttpService],
    });
    service = TestBed.inject(WalletBalanceHistoryHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the Wallet balance history', () => {
    describe('and when asking page to server', () => {
      it('should get the Wallet balance history at specific page', () => {
        let response: WalletBalanceHistoryApi;
        const page = 1337;
        const expectedUrl = `${WALLET_BALANCE_HISTORY_ENDPOINT}?page=${page}`;

        service.get(page).subscribe((data) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_WALLET_BALANCE_HISTORY_API);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_WALLET_BALANCE_HISTORY_API);
      });
    });
  });
});

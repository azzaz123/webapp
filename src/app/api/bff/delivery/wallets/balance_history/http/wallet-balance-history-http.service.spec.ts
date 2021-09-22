import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API } from '@api/fixtures/bff/delivery/wallets/balance_history/wallet-balance-history-api.fixtures.spec';
import { WalletBalanceHistoryQueryParamsApi } from '../dtos/requests/wallet-balance-history-filters-api.interface';
import { WalletBalanceHistoryApi } from '../dtos/responses';
import { WALLET_BALANCE_HISTORY_ENDPOINT } from './endpoints';
import { WalletBalanceHistoryHttpService } from './wallet-balance-history-http.service';

describe('WalletBalanceHistoryHttpService', () => {
  let service: WalletBalanceHistoryHttpService;
  let httpMock: HttpTestingController;
  let queryParams: WalletBalanceHistoryQueryParamsApi;

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
    describe('and when asking an specific page to server', () => {
      const page = 1337;

      beforeEach(() => {
        queryParams = {
          page: page.toString(),
        };
      });

      it('should ask server for an specific page', () => {
        let response: WalletBalanceHistoryApi;
        const expectedUrl = `${WALLET_BALANCE_HISTORY_ENDPOINT}?page=${page}`;

        service.get(queryParams).subscribe((data) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API);
      });
    });

    describe('and when asking for transactions for IN type', () => {
      const page = '0';
      const type = 'IN';

      beforeEach(() => {
        queryParams = {
          page,
          type,
        };
      });

      it('should get ask server for movements from in type Wallet ', () => {
        let response: WalletBalanceHistoryApi;
        const expectedUrl = `${WALLET_BALANCE_HISTORY_ENDPOINT}?page=${page}&type=${type}`;

        service.get(queryParams).subscribe((data) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API);
      });
    });

    describe('and when asking for transactions for OUT type', () => {
      const page = '0';
      const type = 'OUT';

      beforeEach(() => {
        queryParams = {
          page,
          type,
        };
      });

      it('should get ask server for movements from in type Wallet ', () => {
        let response: WalletBalanceHistoryApi;
        const expectedUrl = `${WALLET_BALANCE_HISTORY_ENDPOINT}?page=${page}&type=${type}`;

        service.get(queryParams).subscribe((data) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API);
      });
    });
  });
});

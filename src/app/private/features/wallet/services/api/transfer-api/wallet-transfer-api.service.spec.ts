import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MOCK_API_REQUEST_TO_TRANSFER } from '@fixtures/private/wallet/transfer/wallet-transfer.fixtures.spec';
import {
  PayBankAccountFromUserWalletEndPoint,
  PayUserBankAccountsEndPoint,
  WalletTransferApiService,
} from '@private/features/wallet/services/api/transfer-api/wallet-transfer-api.service';
import { WalletTransferDismissError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-dismiss-error';
import { WalletTransferErrorEnum } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error.enum';
import { WalletTransferErrorResponse } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferGenericError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-generic-error';
import { WalletTransferPayUserBankAccountError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-pay-user-bank-account-error';

describe('WalletTransferApiService', () => {
  let service: WalletTransferApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletTransferApiService],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WalletTransferApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN transfer the money', () => {
    it('should send a request to the api', () => {
      service.transfer(MOCK_API_REQUEST_TO_TRANSFER).subscribe();
      const req: TestRequest = httpMock.expectOne(PayBankAccountFromUserWalletEndPoint);
      req.flush({});

      expect(req.request.url).toEqual(PayBankAccountFromUserWalletEndPoint);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(MOCK_API_REQUEST_TO_TRANSFER);
    });

    describe('AND WHEN there is an unknown error from server', () => {
      it('should map to generic error', () => {
        let response: WalletTransferErrorResponse;

        service.transfer(MOCK_API_REQUEST_TO_TRANSFER).subscribe({
          error: (errorResponse: WalletTransferErrorResponse) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(PayBankAccountFromUserWalletEndPoint);
        req.error([{ error_code: 'unknown', message: 'rip' }] as any);

        expect(response instanceof Error).toBe(true);
      });
    });

    describe('AND WHEN there is a known error from server', () => {
      it('should map to specific error', () => {
        let response: WalletTransferErrorResponse;

        service.transfer(MOCK_API_REQUEST_TO_TRANSFER).subscribe({
          error: (errorResponse: WalletTransferErrorResponse) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(PayBankAccountFromUserWalletEndPoint);
        req.error([{ error_code: WalletTransferErrorEnum.InsufficientFunds, message: 'rip' }] as any);

        expect(response instanceof WalletTransferGenericError).toBe(true);
      });
    });
  });

  describe('WHEN check for pay user bank account', () => {
    it('should send a request to the api', () => {
      service.checkPayUserBankAccount('somestatus').subscribe();
      const req: TestRequest = httpMock.expectOne(`${PayUserBankAccountsEndPoint}?status=somestatus`);
      req.flush({});

      expect(req.request.url).toEqual(PayUserBankAccountsEndPoint);
      expect(req.request.method).toBe('HEAD');
    });

    describe('AND WHEN there is an unknown error from server', () => {
      it('should map to generic error', () => {
        let response: WalletTransferErrorResponse;

        service.checkPayUserBankAccount('somestatus').subscribe({
          error: (errorResponse: WalletTransferErrorResponse) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(`${PayUserBankAccountsEndPoint}?status=somestatus`);
        req.error([{ error_code: 'unknown', message: 'rip' }] as any);

        expect(response instanceof Error).toBe(true);
      });
    });

    describe('AND WHEN there is any error from server', () => {
      it('should map to the specific error', () => {
        let response: WalletTransferErrorResponse;

        service.checkPayUserBankAccount('somestatus').subscribe({
          error: (errorResponse: WalletTransferErrorResponse) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(`${PayUserBankAccountsEndPoint}?status=somestatus`);
        req.error([{ error: 'unknown error', message: 'rip' }] as any);

        expect(response instanceof WalletTransferPayUserBankAccountError).toBe(true);
      });
    });

    describe('AND WHEN there is a not found error from server', () => {
      it('should map to specific error', () => {
        let response: WalletTransferErrorResponse;

        service.checkPayUserBankAccount('somestatus').subscribe({
          error: (errorResponse: WalletTransferErrorResponse) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(`${PayUserBankAccountsEndPoint}?status=somestatus`);
        req.flush('I do not know this url', { status: 404, statusText: 'rip' });

        expect(response instanceof WalletTransferDismissError).toBe(true);
      });
    });
  });
});

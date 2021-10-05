import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MOCK_API_REQUEST_TO_TRANSFER, MOCK_MONEY_TO_TRANSFER } from '@fixtures/private/wallet/transfer/wallet-transfer.fixtures.spec';
import { WalletTransferApiService } from '@private/features/wallet/services/api/transfer-api/wallet-transfer-api.service';
import { WalletTransferMapperService } from '@private/features/wallet/services/transfer/mapper/wallet-transfer-mapper.service';
import { WalletTransferService } from '@private/features/wallet/services/transfer/wallet-transfer.service';

import { of } from 'rxjs';

describe('WalletTransferService', () => {
  let service: WalletTransferService;
  let walletTransferApiService: WalletTransferApiService;
  let walletTransferMapperService: WalletTransferMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletTransferApiService, WalletTransferMapperService, WalletTransferService],
    });

    walletTransferApiService = TestBed.inject(WalletTransferApiService);
    walletTransferMapperService = TestBed.inject(WalletTransferMapperService);
    service = TestBed.inject(WalletTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN transferint the money', () => {
    beforeEach(() => {
      spyOn(walletTransferApiService, 'transfer').and.returnValue(of(null));
      spyOn(walletTransferMapperService, 'mapToRequest').and.returnValue(MOCK_API_REQUEST_TO_TRANSFER);

      service.transfer(MOCK_MONEY_TO_TRANSFER).subscribe();
    });

    it('should map it to the api request', () => {
      expect(walletTransferMapperService.mapToRequest).toHaveBeenCalledWith(MOCK_MONEY_TO_TRANSFER);
    });

    it('should call to the service with the api request', () => {
      const expectedFunds = { funds: MOCK_API_REQUEST_TO_TRANSFER.funds };

      expect(walletTransferApiService.transfer).toHaveBeenCalledWith(jasmine.objectContaining(expectedFunds));
    });
  });

  describe('WHEN checking the pay user bank account', () => {
    beforeEach(() => {
      spyOn(walletTransferApiService, 'checkPayUserBankAccount').and.returnValue(of(null));

      service.checkPayUserBankAccount().subscribe();
    });

    it('should call to the service with the corresponding status', () => {
      const expectedStatus = 'STARTED';

      expect(walletTransferApiService.checkPayUserBankAccount).toHaveBeenCalledWith(expectedStatus);
    });
  });
});

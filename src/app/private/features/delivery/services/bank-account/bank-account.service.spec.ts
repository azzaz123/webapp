import { TestBed } from '@angular/core/testing';
import { BankAccountApiService } from '../api/bank-account-api/bank-account-api.service';
import { BankAccountService } from './bank-account.service';
import { MapBankAccountService } from './map-bank-account/map-bank-account.service';
import {
  MOCK_BANK_ACCOUNT,
  MOCK_API_BANK_ACCOUNT_WITH_COUNTRY,
  MOCK_API_BANK_ACCOUNT,
} from '@fixtures/private/delivery/bank-account/bank-account.fixtures.spec';
import { BankAccount } from '../../interfaces/bank-account/bank-account-api.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('BankAccountService', () => {
  let service: BankAccountService;
  let bankAccountApiService: BankAccountApiService;
  let mapBankAccountService: MapBankAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankAccountService, BankAccountApiService, MapBankAccountService],
    });

    bankAccountApiService = TestBed.inject(BankAccountApiService);
    mapBankAccountService = TestBed.inject(MapBankAccountService);
    service = TestBed.inject(BankAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the main bank account...', () => {
    beforeEach(() => {
      spyOn(bankAccountApiService, 'get').and.returnValue(of(MOCK_API_BANK_ACCOUNT_WITH_COUNTRY));
      spyOn(mapBankAccountService, 'mapBankAccountApiToForm').and.returnValue(MOCK_BANK_ACCOUNT);
    });

    it('should return it with the form format', () => {
      let result: BankAccount;

      service.get().subscribe((bankAccount) => (result = bankAccount));

      expect(bankAccountApiService.get).toHaveBeenCalled();
      expect(mapBankAccountService.mapBankAccountApiToForm).toHaveBeenCalledWith(MOCK_API_BANK_ACCOUNT_WITH_COUNTRY);
      expect(result).toStrictEqual(MOCK_BANK_ACCOUNT);
    });

    it('should update the bank account subject', () => {
      let bankAccountResult: BankAccount;
      let bankAccountSubject: BankAccount;

      service.get().subscribe((bankAccount: BankAccount) => (bankAccountResult = bankAccount));
      service.bankAccount$.subscribe((bankAccount: BankAccount) => (bankAccountSubject = bankAccount));

      expect(bankAccountResult).toStrictEqual(MOCK_BANK_ACCOUNT);
      expect(bankAccountSubject).toStrictEqual(bankAccountResult);
    });
  });

  describe('when creating the main bank account...', () => {
    beforeEach(() => {
      spyOn(service, 'get');
      spyOn(bankAccountApiService, 'create').and.returnValue(of(null));
      spyOn(mapBankAccountService, 'mapBankAccountFormToApi').and.returnValue(MOCK_API_BANK_ACCOUNT);

      service.create(MOCK_BANK_ACCOUNT).subscribe();
    });

    it('should create it already mapped to the api format', () => {
      expect(bankAccountApiService.create).toHaveBeenCalledWith(MOCK_API_BANK_ACCOUNT);
      expect(mapBankAccountService.mapBankAccountFormToApi).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
    });

    it('should get the bank account', () => {
      expect(service.get).toHaveBeenCalled();
    });
  });

  describe('when updating the main bank account...', () => {
    beforeEach(() => {
      spyOn(service, 'get');
      spyOn(bankAccountApiService, 'update').and.returnValue(of(null));
      spyOn(mapBankAccountService, 'mapBankAccountFormToApi').and.returnValue(MOCK_API_BANK_ACCOUNT);

      service.update(MOCK_BANK_ACCOUNT).subscribe();
    });

    it('should update it already mapped to the api format', () => {
      expect(bankAccountApiService.update).toHaveBeenCalledWith(MOCK_API_BANK_ACCOUNT);
      expect(mapBankAccountService.mapBankAccountFormToApi).toHaveBeenCalledWith(MOCK_BANK_ACCOUNT);
    });

    it('should get the bank account', () => {
      expect(service.get).toHaveBeenCalled();
    });
  });

  describe('when deleting the main bank account', () => {
    beforeEach(() => {
      spyOn(bankAccountApiService, 'delete').and.returnValue(of(null));

      service.delete().subscribe();
    });

    it('should call the api service to delete it ', () => {
      expect(bankAccountApiService.delete).toHaveBeenCalled();
    });

    it('should update the bank account subject', () => {
      let result: BankAccount;

      service.bankAccount$.subscribe((bankAccount: BankAccount) => (result = bankAccount));

      expect(result).toBe(null);
    });
  });
});

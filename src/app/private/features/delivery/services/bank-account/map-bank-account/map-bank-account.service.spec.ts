import {
  MOCK_API_BANK_ACCOUNT,
  MOCK_API_BANK_ACCOUNT_WITH_COUNTRY,
  MOCK_BANK_ACCOUNT,
} from '@fixtures/private/delivery/bank-account/bank-account.fixtures.spec';
import { TestBed } from '@angular/core/testing';
import { MapBankAccountService } from './map-bank-account.service';

describe('MapBankAccountService', () => {
  let service: MapBankAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapBankAccountService],
    });
    service = TestBed.inject(MapBankAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when mapping bank account api format to form format', () => {
    it('should return the bank account mapped to form type', () => {
      const mappedFormBankAccount = service.mapBankAccountApiToForm(MOCK_API_BANK_ACCOUNT_WITH_COUNTRY);

      expect(mappedFormBankAccount).toStrictEqual(MOCK_BANK_ACCOUNT);
    });
  });

  describe('when mapping bank account form format to api format', () => {
    it('should return the bank account mapped to api type', () => {
      const mappedApiBankAccount = service.mapBankAccountFormToApi(MOCK_BANK_ACCOUNT);

      expect(mappedApiBankAccount).toStrictEqual(MOCK_API_BANK_ACCOUNT);
    });
  });
});

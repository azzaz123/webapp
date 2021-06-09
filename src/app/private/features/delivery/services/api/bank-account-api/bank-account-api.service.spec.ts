import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  MOCK_API_BANK_ACCOUNT,
  MOCK_API_BANK_ACCOUNT_WITH_COUNTRY,
} from '@fixtures/private/delivery/bank-account/bank-account.fixtures.spec';
import { BankAccountApiWithCountry } from '@private/features/delivery/interfaces/bank-account/bank-account-api.interface';
import { BankAccountApiService, MAIN_BANK_ACCOUNT_URL } from './bank-account-api.service';

describe('BankAccountApiService', () => {
  let service: BankAccountApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankAccountApiService],
    });
    service = TestBed.inject(BankAccountApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the main bank account...', () => {
    it('should send a petition to get the main bank account', () => {
      let response: BankAccountApiWithCountry;

      service.get().subscribe((data: BankAccountApiWithCountry) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(MAIN_BANK_ACCOUNT_URL);
      req.flush(MOCK_API_BANK_ACCOUNT_WITH_COUNTRY);

      expect(response).toEqual(MOCK_API_BANK_ACCOUNT_WITH_COUNTRY);
      expect(req.request.url).toEqual(MAIN_BANK_ACCOUNT_URL);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when creating the main bank account...', () => {
    it('should send a petition to create the main bank account', () => {
      service.create(MOCK_API_BANK_ACCOUNT).subscribe();
      const req: TestRequest = httpMock.expectOne(MAIN_BANK_ACCOUNT_URL);
      req.flush({});

      expect(req.request.url).toEqual(MAIN_BANK_ACCOUNT_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(MOCK_API_BANK_ACCOUNT);
    });
  });

  describe('when updating the main bank account...', () => {
    it('should update the main bank account', () => {
      service.update(MOCK_API_BANK_ACCOUNT).subscribe();
      const req: TestRequest = httpMock.expectOne(MAIN_BANK_ACCOUNT_URL);
      req.flush({});

      expect(req.request.url).toEqual(MAIN_BANK_ACCOUNT_URL);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(MOCK_API_BANK_ACCOUNT);
    });
  });

  describe('when deleting the main bank account...', () => {
    it('should send a petition to delete the main bank account', () => {
      service.delete().subscribe();
      const req: TestRequest = httpMock.expectOne(MAIN_BANK_ACCOUNT_URL);
      req.flush({});

      expect(req.request.url).toBe(MAIN_BANK_ACCOUNT_URL);
      expect(req.request.method).toBe('DELETE');
    });
  });
});

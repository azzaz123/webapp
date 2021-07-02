import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  mockCardRegistrationUrlFormData,
  mockCardTokenizedResponse,
  mockCreditCardSyncRequest,
  mockPaymentsCreditCard,
  mockPaymentsCreateSyncCreditCardRequest,
  mockTokenizerInformationResponse,
  mockPaymentsUpdateSyncCreditCardRequest,
} from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE } from '@api/fixtures/payments/cards/mangopay-card-registration-errors.fixtures.spec';
import { UuidService } from '@core/uuid/uuid.service';
import { PaymentsCreditCardApi } from '../dtos/responses';
import { PAYMENTS_CREDIT_CARDS_ENDPOINT, PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT } from './endpoints';

import { PaymentsCreditCardHttpService } from './payments-credit-card-http.service';

describe('PaymentsCreditCardApiService', () => {
  let service: PaymentsCreditCardHttpService;
  let httpMock: HttpTestingController;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsCreditCardHttpService, UuidService],
    });
    service = TestBed.inject(PaymentsCreditCardHttpService);
    uuidService = TestBed.inject(UuidService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the cards', () => {
    it('should get the cards', () => {
      let response: PaymentsCreditCardApi;

      service.get().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_ENDPOINT);
      req.flush(mockPaymentsCreditCard);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(mockPaymentsCreditCard);
    });
  });

  describe('when asking to create a card', () => {
    beforeEach(() => {
      spyOn(uuidService, 'getUUID').and.returnValue(mockPaymentsCreateSyncCreditCardRequest.id);
    });

    describe('and when the tokenizer server returns an invalid response', () => {
      it('should notify there was an error and stop normal flow', () => {
        const expectedCardTokenizerUrl = mockTokenizerInformationResponse.card_registration_url;
        let expectedErrorResponse = '';

        service.create(mockCreditCardSyncRequest).subscribe({ error: (errorResponse) => (expectedErrorResponse = errorResponse) });

        const tokenizerInfoRequest: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT);
        tokenizerInfoRequest.flush(mockTokenizerInformationResponse);
        const cardTokenizerRequest: TestRequest = httpMock.expectOne(expectedCardTokenizerUrl);
        cardTokenizerRequest.flush(MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE);
        httpMock.expectNone(PAYMENTS_CREDIT_CARDS_ENDPOINT);
        expect(tokenizerInfoRequest.request.method).toEqual('GET');
        expect(cardTokenizerRequest.request.method).toEqual('POST');
        expect(cardTokenizerRequest.request.body).toEqual(mockCardRegistrationUrlFormData);
        expect(cardTokenizerRequest.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
        expect(expectedErrorResponse).toEqual(MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE);
      });
    });

    describe('and when server returns a valid response', () => {
      it('should follow the card creation flow', () => {
        const expectedCardTokenizerUrl = mockTokenizerInformationResponse.card_registration_url;

        service.create(mockCreditCardSyncRequest).subscribe();

        const tokenizerInfoRequest: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT);
        tokenizerInfoRequest.flush(mockTokenizerInformationResponse);
        const cardTokenizerRequest: TestRequest = httpMock.expectOne(expectedCardTokenizerUrl);
        cardTokenizerRequest.flush(mockCardTokenizedResponse);
        const syncCardRequest: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_ENDPOINT);
        syncCardRequest.flush({});
        expect(tokenizerInfoRequest.request.method).toEqual('GET');
        expect(cardTokenizerRequest.request.method).toEqual('POST');
        expect(cardTokenizerRequest.request.body).toEqual(mockCardRegistrationUrlFormData);
        expect(cardTokenizerRequest.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
        expect(syncCardRequest.request.method).toEqual('POST');
        expect(syncCardRequest.request.body).toEqual(mockPaymentsCreateSyncCreditCardRequest);
      });
    });
  });

  describe('when asking to update a card', () => {
    describe('and when the tokenizer server returns an invalid response', () => {
      it('should notify there was an error and stop normal flow', () => {
        const expectedCardTokenizerUrl = mockTokenizerInformationResponse.card_registration_url;
        let expectedErrorResponse = '';

        service.update(mockCreditCardSyncRequest).subscribe({ error: (errorResponse) => (expectedErrorResponse = errorResponse) });

        const tokenizerInfoRequest: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT);
        tokenizerInfoRequest.flush(mockTokenizerInformationResponse);
        const cardTokenizerRequest: TestRequest = httpMock.expectOne(expectedCardTokenizerUrl);
        cardTokenizerRequest.flush(MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE);
        httpMock.expectNone(PAYMENTS_CREDIT_CARDS_ENDPOINT);
        expect(tokenizerInfoRequest.request.method).toEqual('GET');
        expect(cardTokenizerRequest.request.method).toEqual('POST');
        expect(cardTokenizerRequest.request.body).toEqual(mockCardRegistrationUrlFormData);
        expect(cardTokenizerRequest.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
        expect(expectedErrorResponse).toEqual(MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE);
      });
    });

    describe('and when server respons with a valid response', () => {
      it('should follow the card update flow', () => {
        const expectedCardTokenizerUrl = mockTokenizerInformationResponse.card_registration_url;

        service.update(mockCreditCardSyncRequest).subscribe();

        const tokenizerInfoRequest: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT);
        tokenizerInfoRequest.flush(mockTokenizerInformationResponse);
        const cardTokenizerRequest: TestRequest = httpMock.expectOne(expectedCardTokenizerUrl);
        cardTokenizerRequest.flush(mockCardTokenizedResponse);
        const syncCardRequest: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_ENDPOINT);
        syncCardRequest.flush({});
        expect(tokenizerInfoRequest.request.method).toEqual('GET');
        expect(cardTokenizerRequest.request.method).toEqual('POST');
        expect(cardTokenizerRequest.request.body).toEqual(mockCardRegistrationUrlFormData);
        expect(cardTokenizerRequest.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
        expect(syncCardRequest.request.method).toEqual('PUT');
        expect(syncCardRequest.request.body).toEqual(mockPaymentsUpdateSyncCreditCardRequest);
      });
    });
  });

  describe('when asking to delete the cards', () => {
    it('should delete the cards', () => {
      service.delete().subscribe();
      const req: TestRequest = httpMock.expectOne(PAYMENTS_CREDIT_CARDS_ENDPOINT);
      req.flush(mockPaymentsCreditCard);

      expect(req.request.method).toBe('DELETE');
    });
  });
});

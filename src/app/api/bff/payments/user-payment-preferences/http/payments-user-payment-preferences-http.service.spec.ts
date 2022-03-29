import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
} from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { PaymentsUserPaymentPreferencesHttpService } from '@api/bff/payments/user-payment-preferences/http/payments-user-payment-preferences-http.service';
import {
  USER_PAYMENT_PREFERENCES_ENDPOINT,
  USER_PAYMENT_PREFERENCES_UPDATE_ENDPOINT,
} from '@api/bff/payments/user-payment-preferences/http/endpoints';
import { PaymentsUserPaymentPreferencesDto } from '../dtos/responses/payments-user-payment-preferences-dto.interface';
import { PaymentsUserPaymentPreferencesUpdateDto } from '../dtos/requests/payments-user-payment-preferences-update.interface';

describe('PaymentsUserPaymentPreferencesHttpService', () => {
  let service: PaymentsUserPaymentPreferencesHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsUserPaymentPreferencesHttpService],
    });
    service = TestBed.inject(PaymentsUserPaymentPreferencesHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the user payment preferences', () => {
    it('should get the corresponding information', () => {
      let response: PaymentsUserPaymentPreferencesDto;

      service.get().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(USER_PAYMENT_PREFERENCES_ENDPOINT);
      req.flush(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE);
    });
  });

  describe('when asking to update the user payment preferences', () => {
    it('should ask to update the user payment preferences', () => {
      const id: string = MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES.preferences.id;
      const expectedUrl = USER_PAYMENT_PREFERENCES_UPDATE_ENDPOINT(id);
      const body: PaymentsUserPaymentPreferencesUpdateDto = {
        payment_method: 'paypal',
        use_wallet: false,
      };

      service.update(id, body).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(null);

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
    });
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
} from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { PaymentsUserPaymentPreferences } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesHttpService } from '@api/bff/payments/user-payment-preferences/http/payments-user-payment-preferences-http.service';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';

import { of } from 'rxjs';

describe('PaymentsUserPaymentPreferencesService', () => {
  let service: PaymentsUserPaymentPreferencesService;
  let userPaymentPreferencesHttpService: PaymentsUserPaymentPreferencesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsUserPaymentPreferencesService, PaymentsUserPaymentPreferencesHttpService],
    });
    service = TestBed.inject(PaymentsUserPaymentPreferencesService);
    userPaymentPreferencesHttpService = TestBed.inject(PaymentsUserPaymentPreferencesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get the user payment preferences', () => {
    beforeEach(() => {
      spyOn(userPaymentPreferencesHttpService, 'getUserPaymentPreferences').and.returnValue(
        of(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE)
      );
    });

    it('should retrieve the user payment preferences', () => {
      service.paymentUserPreferences.subscribe();

      expect(userPaymentPreferencesHttpService.getUserPaymentPreferences).toHaveBeenCalledTimes(1);
    });

    it('should map server response to web context', () => {
      let response: PaymentsUserPaymentPreferences;

      service.paymentUserPreferences.subscribe((data) => (response = data));

      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES));
    });
  });
});

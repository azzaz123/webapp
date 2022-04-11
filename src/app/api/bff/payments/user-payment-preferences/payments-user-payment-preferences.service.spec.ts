import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_UPDATE_REQUEST,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_ID,
} from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesHttpService } from '@api/bff/payments/user-payment-preferences/http/payments-user-payment-preferences-http.service';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';

import { of } from 'rxjs';
import { UuidService } from '@core/uuid/uuid.service';

describe('PaymentsUserPaymentPreferencesService', () => {
  let service: PaymentsUserPaymentPreferencesService;
  let userPaymentPreferencesHttpService: PaymentsUserPaymentPreferencesHttpService;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaymentsUserPaymentPreferencesService,
        PaymentsUserPaymentPreferencesHttpService,
        {
          provide: UuidService,
          useValue: {
            getUUID() {
              return 'laia';
            },
          },
        },
      ],
    });
    service = TestBed.inject(PaymentsUserPaymentPreferencesService);
    userPaymentPreferencesHttpService = TestBed.inject(PaymentsUserPaymentPreferencesHttpService);
    uuidService = TestBed.inject(UuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get the user payment preferences', () => {
    beforeEach(() => {
      spyOn(userPaymentPreferencesHttpService, 'get').and.returnValue(of(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE));
    });

    it('should retrieve the user payment preferences', () => {
      service.get().subscribe();

      expect(userPaymentPreferencesHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should map server response to web context', () => {
      let response: PaymentsUserPaymentPreferences;

      service.get().subscribe((data) => (response = data));

      expect(response).toEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD);
    });
  });

  describe('when asking to set user payment preferences', () => {
    beforeEach(() => {
      spyOn(userPaymentPreferencesHttpService, 'update').and.returnValue(of(null));
      spyOn(userPaymentPreferencesHttpService, 'create').and.returnValue(of(null));
    });

    describe('and the user has already payment preferences', () => {
      beforeEach(() => {
        service.setUserPaymentPreferences(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES).subscribe();
      });

      it('should NOT ask to create the user payment preferences', () => {
        expect(userPaymentPreferencesHttpService.create).not.toHaveBeenCalled();
      });

      it('should ask to update the user payment preferences', () => {
        expect(userPaymentPreferencesHttpService.update).toHaveBeenCalledTimes(1);
      });

      it('should ask with valid request', () => {
        expect(userPaymentPreferencesHttpService.update).toHaveBeenCalledWith(
          MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES.preferences.id,
          MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_UPDATE_REQUEST
        );
      });
    });

    describe('and the user has NOT payment preferences', () => {
      beforeEach(() => {
        spyOn(uuidService, 'getUUID').and.callThrough();

        service.setUserPaymentPreferences(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_ID).subscribe();
      });

      it('should NOT ask to update the user payment preferences', () => {
        expect(userPaymentPreferencesHttpService.update).not.toHaveBeenCalled();
      });

      it('should ask to create the user payment preferences', () => {
        expect(userPaymentPreferencesHttpService.create).toHaveBeenCalledTimes(1);
      });

      it('should generate a UUID', () => {
        expect(uuidService.getUUID).toHaveBeenCalledTimes(1);
      });

      it('should ask with valid request', () => {
        expect(userPaymentPreferencesHttpService.create).toHaveBeenCalledWith(
          'laia',
          MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_UPDATE_REQUEST
        );
      });
    });
  });
});

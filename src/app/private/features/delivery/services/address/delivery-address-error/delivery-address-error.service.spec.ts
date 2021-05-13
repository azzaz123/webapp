import { TestBed } from '@angular/core/testing';
import { ErrorsService } from '@core/errors/errors.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import {
  MOCK_MAPPED_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER,
  MOCK_MAPPED_ADDRESS_ERROR_INVALID_PHONE_NUMBER,
  MOCK_MAPPED_ADDRESS_ERROR_INVALID_POSTAL_CODE,
  MOCK_DELIVERY_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER,
  MOCK_DELIVERY_ADDRESS_ERROR_INVALID_PHONE_NUMBER,
  MOCK_DELIVERY_ADDRESS_ERROR_INVALID_POSTAL_CODE,
} from '@fixtures/private/delivery/delivery-address-error.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';

import { DeliveryAddressErrorService } from './delivery-address-error.service';

describe('DeliveryAddressErrorService', () => {
  const GENERIC_SAVE_ERROR_KEY = TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR;
  let service: DeliveryAddressErrorService;
  let errorService: ErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorsService,
        {
          provide: I18nService,
          useValue: {
            translate() {
              return '';
            },
          },
        },
        DeliveryAddressErrorService,
        ToastService,
      ],
    });

    service = TestBed.inject(DeliveryAddressErrorService);
    errorService = TestBed.inject(ErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`when we don't pass any error...`, () => {
    it('should show a toast with a generic delivery address save error message', () => {
      spyOn(errorService, 'i18nError');

      service.generateErrors(null);

      expect(errorService.i18nError).toHaveBeenCalledWith(GENERIC_SAVE_ERROR_KEY);
    });

    it('should return an empty array', () => {
      const response = service.generateErrors(null);

      expect(response).toStrictEqual([]);
    });
  });

  describe(`when we have more than one error...`, () => {
    it('should show a toast with a generic delivery address save error message', () => {
      spyOn(errorService, 'i18nError');

      service.generateErrors([MOCK_DELIVERY_ADDRESS_ERROR_INVALID_PHONE_NUMBER, MOCK_DELIVERY_ADDRESS_ERROR_INVALID_POSTAL_CODE]);

      expect(errorService.i18nError).toHaveBeenCalledWith(GENERIC_SAVE_ERROR_KEY);
    });

    it('should return an array with all the generated errors', () => {
      const response = service.generateErrors([
        MOCK_DELIVERY_ADDRESS_ERROR_INVALID_PHONE_NUMBER,
        MOCK_DELIVERY_ADDRESS_ERROR_INVALID_POSTAL_CODE,
      ]);

      expect(response).toStrictEqual([MOCK_MAPPED_ADDRESS_ERROR_INVALID_PHONE_NUMBER, MOCK_MAPPED_ADDRESS_ERROR_INVALID_POSTAL_CODE]);
    });
  });

  describe('when we only have one error...', () => {
    describe(`when it's a toast error type...`, () => {
      it('should show the toast error with the custom message', () => {
        spyOn(errorService, 'i18nError');

        service.generateErrors([MOCK_DELIVERY_ADDRESS_ERROR_INVALID_POSTAL_CODE]);

        expect(errorService.i18nError).toHaveBeenCalledWith(MOCK_MAPPED_ADDRESS_ERROR_INVALID_POSTAL_CODE.translationKey);
      });

      it('should return the address error', () => {
        const response = service.generateErrors([MOCK_DELIVERY_ADDRESS_ERROR_INVALID_POSTAL_CODE]);

        expect(response).toStrictEqual([MOCK_MAPPED_ADDRESS_ERROR_INVALID_POSTAL_CODE]);
      });
    });

    describe(`when it's a form error type...`, () => {
      it('should NOT show the toast error', () => {
        spyOn(errorService, 'i18nError');

        service.generateErrors([MOCK_DELIVERY_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER]);

        expect(errorService.i18nError).not.toHaveBeenCalled();
      });

      it('should return the address error', () => {
        const response = service.generateErrors([MOCK_DELIVERY_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER]);

        expect(response).toStrictEqual([MOCK_MAPPED_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER]);
      });
    });
  });
});

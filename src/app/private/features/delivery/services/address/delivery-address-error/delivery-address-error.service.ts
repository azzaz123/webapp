import { Injectable } from '@angular/core';
import {
  DeliveryAddressError,
  DELIVERY_ADDRESS_ERROR,
} from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { ErrorsService } from '@core/errors/errors.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { AddressError, ADDRESS_ERROR_TYPE } from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';

@Injectable()
export class DeliveryAddressErrorService {
  constructor(private errorService: ErrorsService, private i18n: I18nService) {}

  public generateError(errors: DeliveryAddressError[]): AddressError {
    const error = errors[0];
    if (!errors?.length || errors?.length > 1) {
      this.errorService.i18nError(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR);
    }

    const addressError = this.getAddressError(error.error_code);
    if (addressError.type === ADDRESS_ERROR_TYPE.TOAST) {
      this.errorService.i18nError(addressError.translationKey);
    }
    return this.getAddressError(error.error_code);
  }

  private getAddressError(error: DELIVERY_ADDRESS_ERROR | string): AddressError {
    let translationKey: TRANSLATION_KEY = TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR;
    let type: ADDRESS_ERROR_TYPE = ADDRESS_ERROR_TYPE.TOAST;
    let formControlName: string;

    switch (error) {
      case DELIVERY_ADDRESS_ERROR['invalid phone number']:
        translationKey = TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_INVALID_PHONE_NUMBER_ERROR;
        formControlName = 'phone_number';
        break;
      case DELIVERY_ADDRESS_ERROR['invalid postal code']:
        translationKey = TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_INVALID_POSTAL_CODE_ERROR;
        formControlName = 'postal_code';
        break;
      case DELIVERY_ADDRESS_ERROR['postal code is not allowed']:
        translationKey = TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_POSTAL_CODE_NOT_ALLOWED_ERROR;
        formControlName = 'postal_code';
        break;
      case DELIVERY_ADDRESS_ERROR['delivery address too long']:
        translationKey = TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_TOO_LONG_ERROR;
        formControlName = 'street';
        break;
      case DELIVERY_ADDRESS_ERROR['flat and floor too long']:
        translationKey = TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_FLATANDFLOOR_TOO_LONG_ERROR;
        formControlName = 'flat_and_floor';
        break;
      case DELIVERY_ADDRESS_ERROR['postal code not exists']:
        translationKey = TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_EXISTS_ERROR;
        formControlName = 'postal_code';
        break;
      case DELIVERY_ADDRESS_ERROR['invalid mobile phone number']:
        translationKey = TRANSLATION_KEY.DELIVERY_ADDRESS_PHONE_MISSMATCH_LOCATION_ERROR;
        formControlName = 'phone_number';
        type = ADDRESS_ERROR_TYPE.FORM;
        break;
    }

    return {
      translationKey,
      translation: this.i18n.translate(translationKey),
      formControlName,
      type,
    };
  }
}

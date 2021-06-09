import { DeliveryBankAccountErrorTranslations } from '../../constants/delivery-error-translations';
import { BankAccountError } from './bank-account.error';

export class PlatformResponseIsInvalidError extends BankAccountError {
  constructor() {
    super(DeliveryBankAccountErrorTranslations.PLATFORM_RESPONSE_INVALID);
  }
}

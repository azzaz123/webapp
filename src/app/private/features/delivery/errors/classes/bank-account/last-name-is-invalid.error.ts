import { DeliveryBankAccountErrorTranslations } from '../../constants/delivery-error-translations';
import { BankAccountError } from './bank-account.error';

export class LastNameIsInvalidError extends BankAccountError {
  constructor() {
    super(DeliveryBankAccountErrorTranslations.OWNER_LAST_NAME_INVALID);
  }
}

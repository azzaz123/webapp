import { DeliveryBankAccountErrorTranslations } from '../../constants/delivery-error-translations';
import { BankAccountError } from './bank-account.error';

export class OwnerNameIsInvalidError extends BankAccountError {
  constructor() {
    super(DeliveryBankAccountErrorTranslations.OWNER_NAME_INVALID);
  }
}

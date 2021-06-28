import { PaymentsCardsError } from './payments-cards.error';
import { PAYMENTS_CARDS_ERROR_TRANSLATIONS } from './payments-cards-error-translations';

export class CardIsNotAuthorizedError extends PaymentsCardsError {
  constructor() {
    super(PAYMENTS_CARDS_ERROR_TRANSLATIONS.CARD_REFUSED);
  }
}

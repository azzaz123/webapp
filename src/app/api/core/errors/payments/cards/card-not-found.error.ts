import { PAYMENTS_CARDS_ERROR_TRANSLATIONS } from './payments-cards-error-translations';
import { PaymentsCardsError } from './payments-cards.error';

export class CardNotFoundError extends PaymentsCardsError {
  constructor() {
    super(PAYMENTS_CARDS_ERROR_TRANSLATIONS.CARD_ERROR);
  }
}

import { CREDIT_CARD_STATUS } from '@api/core/model/cards/credit-card-status.enum';
import { CreditCard, CreditCardBrand } from '@api/core/model/cards/credit-card.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { PaymentsCreditCardApi, PaymentsCreditCardStatusApi } from '@api/payments/cards/dtos/responses';

export const mapPaymentsCreditCardToCreditCard: ToDomainMapper<PaymentsCreditCardApi, CreditCard> = (
  input: PaymentsCreditCardApi
): CreditCard => {
  const { card_holder_name: ownerFullName, id, number_alias, expiration_date, status: rawStatus } = input;

  const brand = getCardBrandFromAlias(number_alias);
  const lastFourDigits = getLastFourDigitsFromCardAlias(number_alias);
  const expirationDate = new Date(expiration_date);
  const status: CREDIT_CARD_STATUS = getCardStatus(rawStatus);

  return {
    id,
    brand,
    lastFourDigits,
    ownerFullName,
    expirationDate,
    provider: 'mangopay',
    status,
  };
};

function getLastFourDigitsFromCardAlias(cardAlias: string): string {
  let lastFourDigits = '0000';

  try {
    lastFourDigits = cardAlias.slice(cardAlias.length - 4, cardAlias.length);
  } catch {}

  return lastFourDigits;
}

function getCardBrandFromAlias(cardAlias: string): CreditCardBrand {
  const isVisa = cardAlias.startsWith('4');
  return isVisa ? 'visa' : 'mastercard';
}

const creditCardStatus: Record<PaymentsCreditCardStatusApi, CREDIT_CARD_STATUS> = {
  VALID: CREDIT_CARD_STATUS.VALID,
  INVALID: CREDIT_CARD_STATUS.INVALID,
  PENDING_3DS: CREDIT_CARD_STATUS.PENDING_3DS,
};

function getCardStatus(status: PaymentsCreditCardStatusApi): CREDIT_CARD_STATUS {
  return creditCardStatus[status] ?? CREDIT_CARD_STATUS.UNKNOWN;
}

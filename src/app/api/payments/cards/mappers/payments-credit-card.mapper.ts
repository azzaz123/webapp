import { CreditCard, CreditCardBrand } from '@api/core/model/cards/credit-card.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { PaymentsCreditCardApi } from '../dtos/responses';

export const mapPaymentsCreditCardToCreditCard: ToDomainMapper<PaymentsCreditCardApi, CreditCard> = (
  input: PaymentsCreditCardApi
): CreditCard => {
  const { card_holder_name: ownerFullName, id, number_alias, expiration_date } = input;

  const brand = getCardBrandFromAlias(number_alias);
  const lastFourDigits = getLastFourDigitsFromCardAlias(number_alias);
  const expirationDate = new Date(expiration_date);

  return {
    id,
    brand,
    lastFourDigits,
    ownerFullName,
    expirationDate,
    provider: 'mangopay',
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

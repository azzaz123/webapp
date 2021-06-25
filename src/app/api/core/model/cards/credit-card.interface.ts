export type CreditCardId = string;
export type CreditCardBrand = 'visa' | 'mastercard';
export type CreditCardProvider = 'stripe' | 'mangopay';

export interface CreditCard {
  id: CreditCardId;
  brand: CreditCardBrand;
  lastFourDigits: string;
  expirationDate: Date;
  ownerFullName?: string;
  provider: CreditCardProvider;
}

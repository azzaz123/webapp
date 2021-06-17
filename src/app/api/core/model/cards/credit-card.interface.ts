export type CreditCardBrand = 'visa' | 'mastercard';
export type CreditCardProvider = 'stripe' | 'mangopay';

export interface CreditCard {
  id: string;
  brand: CreditCardBrand;
  lastFourDigits: string;
  expirationDate: Date;
  ownerFullName?: string;
  provider: CreditCardProvider;
}

import { mockCreditCard, mockPaymentsCreditCard } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { mapPaymentsCreditCardToCreditCard } from './payments-credit-card.mapper';

describe('PaymentsCreditCardMapper', () => {
  describe('when transforming payments server response to web context', () => {
    it('should transform the data', () => {
      const result = mapPaymentsCreditCardToCreditCard(mockPaymentsCreditCard);

      expect(result).toEqual(mockCreditCard);
    });
  });
});

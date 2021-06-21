import { PaymentsCardsErrorMapper } from './payments-cards-error-mapper';

const paymentsCardsErrorMapper = new PaymentsCardsErrorMapper();

describe('PaymentsCardsErrorMapper', () => {
  it('should create the mapper', () => {
    expect(paymentsCardsErrorMapper).toBeTruthy();
  });
});

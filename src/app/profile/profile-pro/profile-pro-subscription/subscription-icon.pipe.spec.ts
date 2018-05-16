import { SubscriptionIconPipe } from './subscription-icon.pipe';
import { Pack } from '../../../core/payments/payment.interface';

describe('SubscriptionIconPipe', () => {

  let pipe: SubscriptionIconPipe;
  const PACK: Pack = {
    id: 'id',
    quantity: 100,
    price: 100,
    currency: 'EUR',
    discount: 10
  };
  const PERSONAL_PACK: Pack = {
    id: 'id',
    quantity: 300,
    price: 100,
    currency: 'EUR',
    discount: 10
  };

  beforeEach(() => {
    pipe = new SubscriptionIconPipe();
  });

  it('should return icon name', () => {
    expect(pipe.transform(PACK)).toBe('plan-100');
  });

  it('should return icon name with -selected', () => {
    expect(pipe.transform(PACK, true)).toBe('plan-100-selected');
  });

  it('should return icon name with personal pack', () => {
    expect(pipe.transform(PERSONAL_PACK)).toBe('plan-personal');
  });

  it('should return icon name with personal pack with -selected', () => {
    expect(pipe.transform(PERSONAL_PACK, true)).toBe('plan-personal-selected');
  });
});

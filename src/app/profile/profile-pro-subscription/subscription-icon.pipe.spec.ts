import { SubscriptionIconPipe } from './subscription-icon.pipe';
import { Pack } from '../../core/payments/pack';

describe('SubscriptionIconPipe', () => {

  let pipe: SubscriptionIconPipe;
  const PACK: Pack = new Pack(
    'id',
    100,
    100,
    'EUR',
    'citybump'
  );
  const PERSONAL_PACK: Pack = new Pack(
    'id',
    300,
    100,
    'EUR',
    'citybump'
  );

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

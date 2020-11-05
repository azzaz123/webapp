import { SubscriptionIconPipe } from './subscription-icon.pipe';
import { Pack } from '../../core/payments/pack';

describe('SubscriptionIconPipe', () => {
  let pipe: SubscriptionIconPipe;
  const PACK: Pack = new Pack('id', 100, 100, 'EUR', 'citybump');
  const PERSONAL_PACK: Pack = new Pack('id', 300, 100, 'EUR', 'citybump');

  beforeEach(() => {
    pipe = new SubscriptionIconPipe();
  });

  it('should return icon path', () => {
    expect(pipe.transform(PACK)).toBe('/assets/icons/plans/plan100.svg');
  });

  it('should return icon path with _selected', () => {
    expect(pipe.transform(PACK, true)).toBe(
      '/assets/icons/plans/plan100_selected.svg'
    );
  });

  it('should return icon path with personal pack', () => {
    expect(pipe.transform(PERSONAL_PACK)).toBe(
      '/assets/icons/plans/planpersonal.svg'
    );
  });

  it('should return icon path with personal pack with _selected', () => {
    expect(pipe.transform(PERSONAL_PACK, true)).toBe(
      '/assets/icons/plans/planpersonal_selected.svg'
    );
  });
});

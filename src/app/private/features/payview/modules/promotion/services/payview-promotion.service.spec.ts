import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PayviewPromotionEventType } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.interface';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';

describe('PayviewPromotionService', () => {
  const fakePromocode: string = 'This_is_a_fake_promocode';
  let service: PayviewPromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayviewPromotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN applying a promotion code', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: string;
      const expected: string = fakePromocode;
      const subscription = service.on(PayviewPromotionEventType.ApplyPromocode, (payload: string) => {
        subscription.unsubscribe();
        result = payload;
      });

      service.applyPromocode(fakePromocode);
      tick();

      expect(result).toBe(expected);
    }));
  });

  describe('WHEN deleting the promocode', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PayviewPromotionEventType.DeletePromocode, () => {
        subscription.unsubscribe();
        result++;
      });

      service.deletePromocode();
      tick();

      expect(result).toBe(expected);
    }));
  });

  describe('WHEN opening the promocode editor', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PayviewPromotionEventType.OpenPromocodeEditor, () => {
        subscription.unsubscribe();
        result++;
      });

      service.openPromocodeEditor();
      tick();

      expect(result).toBe(expected);
    }));
  });
});

import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PAYVIEW_PROMOTION_EVENT_TYPE } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.enum';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
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
      const subscription = service.on(PAYVIEW_PROMOTION_EVENT_TYPE.APPLY_PROMOCODE, (payload: string) => {
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
      const subscription = service.on(PAYVIEW_PROMOTION_EVENT_TYPE.REMOVE_PROMOCODE, () => {
        subscription.unsubscribe();
        result++;
      });

      service.removePromocode();
      tick();

      expect(result).toBe(expected);
    }));
  });

  describe('WHEN opening the promocode editor', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PAYVIEW_PROMOTION_EVENT_TYPE.OPEN_PROMOCODE_EDITOR, () => {
        subscription.unsubscribe();
        result++;
      });

      service.openPromocodeEditor();
      tick();

      expect(result).toBe(expected);
    }));
  });

  describe('WHEN report an error', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      const fakeError: PayviewError = {
        code: 'This_is_a_fake_code',
        message: 'This_is_a_fake_message',
      };
      let result: PayviewError;
      const subscription = service.on(PAYVIEW_PROMOTION_EVENT_TYPE.ERROR, (payload: PayviewError) => {
        subscription.unsubscribe();
        result = payload;
      });

      service.error(fakeError);
      tick();

      expect(result).toEqual(fakeError);
    }));
  });
});

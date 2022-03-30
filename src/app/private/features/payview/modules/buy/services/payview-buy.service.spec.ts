import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PAYVIEW_BUY_EVENT_TYPE } from '@private/features/payview/modules/buy/enums/payview-buy-event-type.enum';
import { PayviewBuyService } from '@private/features/payview/modules/buy/services/payview-buy.service';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';

describe('PayviewBuyService', () => {
  let service: PayviewBuyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayviewBuyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN buying', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      const expected: number = 1;
      let result: number = 0;

      const subscription = service.on(PAYVIEW_BUY_EVENT_TYPE.BUY, () => {
        subscription.unsubscribe();
        result++;
      });

      service.buy();
      tick();

      expect(result).toBe(expected);
    }));
  });

  describe('WHEN reporting an error', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      const fakeError: PayviewError = {
        code: 'This_is_a_fake_code',
        message: 'This_is_a_fake_message',
      };
      let result: PayviewError;
      const subscription = service.on(PAYVIEW_BUY_EVENT_TYPE.ERROR, (payload: PayviewError) => {
        subscription.unsubscribe();
        result = payload;
      });

      service.error(fakeError);
      tick();

      expect(result).toEqual(fakeError);
    }));
  });
});

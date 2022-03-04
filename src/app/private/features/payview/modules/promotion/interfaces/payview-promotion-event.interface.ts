import { PayviewPromotionEventType } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.interface';

export interface PayviewPromotionEvent {
  payload: string | null;
  type: PayviewPromotionEventType;
}

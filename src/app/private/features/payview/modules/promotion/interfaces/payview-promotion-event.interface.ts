import { PAYVIEW_PROMOTION_EVENT_TYPE } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.enum';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';

export interface PayviewPromotionEvent {
  payload: string | null | PayviewError;
  type: PAYVIEW_PROMOTION_EVENT_TYPE;
}

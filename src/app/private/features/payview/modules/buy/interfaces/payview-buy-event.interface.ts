import { PAYVIEW_BUY_EVENT_TYPE } from '@private/features/payview/modules/buy/enums/payview-buy-event-type.enum';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';

export interface PayviewBuyEvent {
  payload: string | null | PayviewError;
  type: PAYVIEW_BUY_EVENT_TYPE;
}

import { PAYVIEW_EVENT_TYPE } from '@private/features/payview/enums/payview-event-type.enum';
import { PAYVIEW_EVENT_PAYLOAD } from '@private/features/payview/types/payview-event-payload.type';

export interface PayviewEvent {
  payload: PAYVIEW_EVENT_PAYLOAD;
  type: PAYVIEW_EVENT_TYPE;
}

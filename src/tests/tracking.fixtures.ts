import { TrackingEvent } from '../app/core/tracking/tracking-event';
import { TrackingService } from '../app/core/tracking/tracking.service';

export const TRACKING_EVENT: TrackingEvent = new TrackingEvent({
    screen: {
      width: 1366,
      height: 768
    },
    locale: 'es'
  },
  'chat',
  'userId',
  '2016-04-05 10:59:39.977',
  TrackingService.PRODUCT_DELETED);

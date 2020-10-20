import { TrackingEvent } from '../app/core/tracking/tracking-event';
import { TrackingService } from '../app/core/tracking/tracking.service';
import { TrackingEventBase, TrackingEventData } from '../app/core/tracking/tracking-event-base.interface';

export const TRACKING_EVENT: TrackingEvent = new TrackingEvent(
  'userId',
  '2016-04-05 10:59:39.977',
  TrackingService.PRODUCT_DELETED);

/* istanbul ignore next */
export class MockTrackingService {
  track(event: TrackingEventBase, params?: any) {
  }
}


export interface TrackingEventBase {
  name: string;
  category: string;
  type?: string;
  screen?: string;
  attributes?: any; // TODO - remove when we will switch to sending all events batched
}

export interface TrackingEventData {
  eventData: TrackingEventBase;
  id?: string;
  timestamp?: string;
  attributes?: any;
}

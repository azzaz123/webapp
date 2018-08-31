export interface TrackingEventBase {
  name: string;
  category: string;
  attributes?: any;
  type?: string;
  screen?: string;
  id?: string;
  timestamp?: string;
}

export interface TrackingEventData {
  eventData: {
    name: string;
    category: string;
    type?: string;
    screen?: string;
  };
  id?: string;
  timestamp?: string;
  attributes?: any;
}

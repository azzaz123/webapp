import { UUID } from 'angular2-uuid';
import { TrackingEventBase } from './tracking-event-base.interface';
import { getTimestamp } from './getTimestamp.func';
import { replace } from 'lodash-es';

export class TrackingEvent {
  sessions: any[] = [{
    id: null,
    startTimestamp: null,
    userId: '',
    device: {
      platform: null,
      model: null,
      screenwidth: null,
      screenheight: null,
      locale: null,
      type: null,
      os: null,
      deviceAccessTokenId: null
    },
    app: {
      id: 'web',
      version: '2.0',
    },
    sdkVersion: '1.0',
    events: [],
    window: null
  }];

  constructor(userId: string, sessionStartTime: string, event?: TrackingEventBase, events?: Array<any>) {
    if (events) {
      this.sessions[0].events = events;
    } else {
      this.sessions[0].events[0] = event;
      this.sessions[0].events[0].id = UUID.UUID();
      this.sessions[0].events[0].timestamp = getTimestamp();
    }
    this.sessions[0].userId = userId;
    this.sessions[0].window = window;
    this.sessions[0].startTimestamp = sessionStartTime;
  }

  public setDeviceInfo(operativeSystemVersion: string, OSName: string, deviceAccessTokenId: string, browserName: string, browserVersion: string) {
    this.sessions[0].device = {
      type: 'Computer',
      manufacturer: browserName,
      model: browserVersion,
      platform: OSName,
      os: operativeSystemVersion,
      screenwidth: this.sessions[0].window.screen.width.toString(),
      screenheight: this.sessions[0].window.screen.height.toString(),
      locale: replace(navigator.language, '-', '_'),
      deviceAccessTokenId: deviceAccessTokenId
    };
  }

  public setAttributes(attributes: any) {
    this.sessions[0].events[0].attributes = attributes;
  }

  public setSessionId(sessionId: string) {
      this.sessions[0].id = sessionId;
  }

}

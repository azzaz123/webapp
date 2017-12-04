import { TrackingService } from './tracking.service';
import { UUID } from 'angular2-uuid';
import { TrackingEventBase } from './tracking-event-base.interface';

export const SCREEN_MAPPING: any = {
  chat: '89',
  catalog: '91',
  login: '90'
};

export class TrackingEvent {
  private sessions: any[] = [{
    id: TrackingService.TRACKING_SESSION_UUID,
    startTimestamp: null,
    userId: '',
    device: {
      platform: null,
      model: null,
      screenwidth: null,
      screenheight: null,
      locale: null,
      type: null,
      os: null
    },
    app: {
      id: 'web',
      version: '2.0',
    },
    sdkVersion: '1.0',
    events: [],
    window: null
  }];

  constructor(window: any, origin: string, userId: string, sessionStartTime: string, event?: TrackingEventBase) {
    this.sessions[0].events[0] = event;
    this.sessions[0].events[0].id = UUID.UUID();
    this.sessions[0].userId = userId;
    this.sessions[0].window = window;
    this.sessions[0].startTimestamp = sessionStartTime;
    this.setScreenIfEmpty(origin);
    this.setTimestamp();
    this.setTypeIfEmpty();
  }

  private setScreenIfEmpty(origin: string) {
    if (!this.sessions[0].events[0].screen) {
      this.sessions[0].events[0].screen = (SCREEN_MAPPING[origin.replace('/', '')]);
    }
  }

  private setTimestamp() {
    const now: Date = new Date();
    const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.toLocaleTimeString()}.${now.getMilliseconds()}`;
    this.sessions[0].events[0].timestamp = timestamp;
  }

  private setTypeIfEmpty() {
    if (!this.sessions[0].events[0].type) {
      this.sessions[0].events[0].type = '0';
    }
  }

  public setDeviceInfo(operativeSystemVersion: string, OSName: string) {
    this.sessions[0].device = {
      platform: OSName,
      screenwidth: this.sessions[0].window.screen.width.toString(),
      screenheight: this.sessions[0].window.screen.height.toString(),
      locale: navigator.language,
      type: 'PC',
      os: operativeSystemVersion
    };
  }

  public setAttributes(attributes: any) {
    this.sessions[0].events[0].attributes = attributes;
  }

}

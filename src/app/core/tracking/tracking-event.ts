import { TrackingService } from './tracking.service';
import { UUID } from 'angular2-uuid';
import { TrackingEventBase } from './tracking-event-base.interface';

const ENTRY_POINTS_MAPPING: any = {
  chat: '89',
  catalog: '91',
  login: '90',
  dashboard: '95',
  calls: '94'
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
    entryPoint: 'protool',
    events: [],
    window: null
  }];

  constructor(window: any, origin: string, userId: string, sessionStartTime: string, event?: TrackingEventBase) {
    this.sessions[0].events[0] = event;
    this.sessions[0].events[0].id = UUID.UUID();
    this.sessions[0].userId = userId;
    this.sessions[0].window = window;
    this.sessions[0].startTimestamp = sessionStartTime;
    this.setEntryPoint(origin);
    const now: Date = new Date();
    this.sessions[0].events[0].timestamp =
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.toLocaleTimeString()}.${now.getMilliseconds()}`;
    if (!this.sessions[0].events[0].type) {
      this.sessions[0].events[0].type = '0';
    }
  }

  private setEntryPoint(origin: string) {
    this.sessions[0].entryPoint = (ENTRY_POINTS_MAPPING[origin.replace('/', '')]);
    if (!this.sessions[0].events[0].screen) {
      this.sessions[0].events[0].screen = (ENTRY_POINTS_MAPPING[origin.replace('/', '')]);
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

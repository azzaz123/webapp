import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as Sentry from '@sentry/angular';

const SENTRY_DSN = 'https://1d0e1781157041509326a1072f4ad490@o608018.ingest.sentry.io/5839391';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  constructor() {}

  public initialize(): void {
    if (environment.production) {
      Sentry.init({
        environment: environment.name,
        dsn: SENTRY_DSN,
        tracesSampleRate: 0.1,
        allowUrls: [/https?:\/\/(.*)\.wallapop\.com/],
      });
    }
  }
}

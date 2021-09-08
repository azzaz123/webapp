import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as Sentry from '@sentry/angular';

export const SENTRY_DSN = 'https://1d0e1781157041509326a1072f4ad490@o608018.ingest.sentry.io/5839391';
export const TRACES_SAMPLE_RATE = 0.1;
export const WALLAPOP_DOMAIN_REGEX = /https?:\/\/it\.wallapop\.com/;

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
        tracesSampleRate: TRACES_SAMPLE_RATE,
        allowUrls: [WALLAPOP_DOMAIN_REGEX],
      });
    }
  }
}

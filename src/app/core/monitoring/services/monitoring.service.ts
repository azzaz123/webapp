import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as Sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  constructor() {}

  public initialize(): void {
    Sentry.init({
      environment: environment.name,
      dsn: 'https://1d0e1781157041509326a1072f4ad490@o608018.ingest.sentry.io/5839391',
      tracesSampleRate: 0.1,
      allowUrls: [/https?:\/\/(.*)\.wallapop\.com/],
    });
  }
}

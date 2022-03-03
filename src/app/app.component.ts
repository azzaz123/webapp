import { Component, OnInit } from '@angular/core';
import { ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, OpenWallapop } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { DeviceService } from '@core/device/device.service';
import { SessionService } from '@core/session/session.service';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';

@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private analyticsService: AnalyticsService,
    private deviceService: DeviceService,
    private sessionService: SessionService,
    private standaloneService: StandaloneService
  ) {}

  ngOnInit(): void {
    this.onNewSessionStart().subscribe(() => this.trackOpenWallapop());
    this.trackStandaloneModeStatus();
  }

  private onNewSessionStart(): Observable<void> {
    return this.analyticsService.mParticleReady$.pipe(
      concatMap(() => this.sessionService.newSession$),
      take(1)
    );
  }

  private trackOpenWallapop(): void {
    this.analyticsService.trackEvent<OpenWallapop>({
      name: ANALYTICS_EVENT_NAMES.OpenWallapop,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        currentUrl: window.location.href,
        refererUrl: document.referrer,
        webPlatformType: this.deviceService.getDeviceType(),
        webDeviceId: this.deviceService.getDeviceId(),
      },
    });
  }

  private trackStandaloneModeStatus(): void {
    if (this.standaloneService.standalone) {
      ga('send', 'event', 'Standalone', 'enabled');
    }
  }
}

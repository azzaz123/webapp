import { Component, OnInit } from '@angular/core';
import { ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, OpenWallapop } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { DeviceService } from '@core/device/device.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { SessionService } from '@core/session/session.service';
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
    private externalCommsService: ExternalCommsService
  ) {}

  ngOnInit(): void {
    //TODO: This should be moved to a higer level entity (providers.ts or equivalent)
    this.initSubscriptions();
    this.initServices();
  }

  private initSubscriptions(): void {
    this.onNewSessionStart().subscribe(() => this.trackOpenWallapop());
    this.onMParticleInit().subscribe(() => this.externalCommsService.initializeBrazeCommunications());
  }

  private initServices(): void {
    this.sessionService.initSession();
    this.analyticsService.initialize();
  }

  private onMParticleInit(): Observable<void> {
    return this.analyticsService.mParticleReady$.pipe(take(1));
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
}

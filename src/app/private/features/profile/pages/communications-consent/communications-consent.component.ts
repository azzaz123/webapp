import { Component, OnInit } from '@angular/core';
import { CommunicationsConsent, CommunicationsConsentGroup } from '@api/core/model/communications-consent';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  UpdateNotificationSetting,
  ViewNotificationSettings,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CommunicationsConsentApiService } from '@api/communications-consent/communications-consent-api.service';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'tsl-communications-consent',
  templateUrl: './communications-consent.component.html',
  styleUrls: ['./communications-consent.component.scss'],
})
export class CommunicationsConsentComponent implements OnInit {
  public allowSegmentation: boolean;
  private _settingsSubject: Subject<CommunicationsConsentGroup[]> = new Subject<CommunicationsConsentGroup[]>();

  constructor(private consentApiService: CommunicationsConsentApiService, private analyticsService: AnalyticsService) {}

  public get consentSettings$(): Observable<CommunicationsConsentGroup[]> {
    return this._settingsSubject.asObservable();
  }

  ngOnInit(): void {
    this.getConsentSettings();
    this.trackViewCommunicationsConsent();
  }

  public getConsentSettings() {
    this.consentApiService.getCommunicationsConsentSettings().subscribe((settings) => this._settingsSubject.next(settings));
  }

  public handleChange(consent: CommunicationsConsent) {
    const { id, enabled } = consent;

    if (enabled) {
      this.consentApiService.setConsentEnable(id).subscribe();
    } else {
      this.consentApiService.setConsentDisabled(id).subscribe();
    }
    this.trackUpdateCommunicationsConsent(id, enabled);
  }

  private trackViewCommunicationsConsent(): void {
    const event: AnalyticsPageView<ViewNotificationSettings> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationSettings,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private trackUpdateCommunicationsConsent(consentId: string, enabled: boolean): void {
    const event: AnalyticsEvent<UpdateNotificationSetting> = {
      name: ANALYTICS_EVENT_NAMES.UpdateNotificationSetting,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
        consent: enabled,
        notificationId: consentId,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}

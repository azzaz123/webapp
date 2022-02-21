import { Component, OnInit } from '@angular/core';
import { NotificationConsent, NotificationSettings } from '@api/core/model/notifications';
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
import { NotificationsApiService } from '@api/notifications/notifications-api.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'tsl-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  // TODO
  // RENAME ALL RELATED WITH NOTIFICATIONS ======> COMUNICATION CONSENT (COMPONENT, API (APP/API/NOTIFICATIONS), FIXTURES...)
  public allowSegmentation: boolean;
  public notificationsSettings$: Observable<NotificationSettings[]> = this.getMyNotificationsSettings();

  constructor(private notificationsApiService: NotificationsApiService, private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.getMyNotificationsSettings();
    this.trackViewNotificationSettings();
  }

  public getMyNotificationsSettings() {
    return this.notificationsApiService.getMyNotificationsSettings();
  }

  public handleChange(notification: NotificationConsent) {
    const { id, enabled } = notification;

    if (enabled) {
      this.notificationsApiService.setNotificationEnable(id).subscribe();
    } else {
      this.notificationsApiService.setNotificationDisabled(id).subscribe();
    }
    this.trackUpdateNotification(id, enabled);
  }

  private trackViewNotificationSettings(): void {
    const event: AnalyticsPageView<ViewNotificationSettings> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationSettings,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private trackUpdateNotification(notificationId: string, consent: boolean): void {
    const event: AnalyticsEvent<UpdateNotificationSetting> = {
      name: ANALYTICS_EVENT_NAMES.UpdateNotificationSetting,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
        consent,
        notificationId,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}

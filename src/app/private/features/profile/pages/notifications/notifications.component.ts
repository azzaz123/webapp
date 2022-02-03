import { Component, OnInit } from '@angular/core';
import { MeApiService } from '@api/me/me-api.service';
import { NotificationConsent, NotificationSettings } from '@api/core/model/notifications';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  UpdateCLMNotification,
  UpdatePromoNotification,
  ViewNotificationSettings,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Component({
  selector: 'tsl-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public notificationsSettingsGroup: NotificationSettings[];
  public allowSegmentation: boolean;
  private readonly savedSearchedNotificationId = 'l1kmzng6n3p8';
  private readonly idTipsNotification = 'y98ejk1zxmwp';
  private readonly idPromoNotification = 'd9ke65vmjox1';

  constructor(private meApiService: MeApiService, private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.getMyNotificationsSettings();
    this.trackViewNotificationSettings();
  }

  public getMyNotificationsSettings() {
    this.meApiService.getMyNotificationsSettings().subscribe((data) => {
      const filteredNotifications = data
        .map((nGroup) => {
          const noSavedSearchesId = nGroup.notifications.find((notification) => notification.id !== this.savedSearchedNotificationId);
          if (noSavedSearchesId) {
            return nGroup;
          }
        })
        .filter((ngroup) => !!ngroup);
      this.notificationsSettingsGroup = filteredNotifications;
    });
  }

  public handleChange(notification: NotificationConsent) {
    const { id, enabled } = notification;

    if (enabled) {
      this.meApiService.setNotificationEnable(id).subscribe();
    } else {
      this.meApiService.setNotificationDisabled(id).subscribe();
    }

    if (id === this.idTipsNotification) {
      this.trackCLMUpdateNotification(enabled);
    }
    if (id === this.idPromoNotification) {
      this.trackPromoUpdateNotification(enabled);
    }
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

  private trackCLMUpdateNotification(consent: boolean): void {
    const event: AnalyticsEvent<UpdateCLMNotification> = {
      name: ANALYTICS_EVENT_NAMES.UpdateCLMNotification,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
        consent,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  private trackPromoUpdateNotification(consent: boolean): void {
    const event: AnalyticsEvent<UpdatePromoNotification> = {
      name: ANALYTICS_EVENT_NAMES.UpdatePromoNotification,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.NotificationSettings,
        consent,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}

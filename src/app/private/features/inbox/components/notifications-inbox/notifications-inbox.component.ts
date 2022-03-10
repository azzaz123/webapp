import { Component, OnInit } from '@angular/core';
import { Notification } from '@api/core/model/notification/notification.interface';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { AnalyticsPageView, ViewNotificationCenter, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tsl-notifications-inbox',
  templateUrl: './notifications-inbox.component.html',
  styleUrls: ['./notifications-inbox.component.scss'],
})
export class NotificationsInboxComponent implements OnInit {
  constructor(private analyticsService: AnalyticsService, private notificationApiService: NotificationApiService) {}

  get notifications$(): Observable<Notification[]> {
    return this.notificationApiService.notifications$;
  }

  ngOnInit(): void {
    this.trackViewNotificationCenter();
    this.notificationApiService.refreshNotifications();
    this.notificationApiService.logContentCardsDisplayed();
  }

  public trackViewNotificationCenter(): void {
    const event: AnalyticsPageView<ViewNotificationCenter> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationCenter,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        numberOfTotalNotifications: this.notificationApiService.notificationsCount,
        numberOfUnreadNotifications: this.notificationApiService.unreadNotificationsCount,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}

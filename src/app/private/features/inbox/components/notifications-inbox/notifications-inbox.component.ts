import { Component, OnInit } from '@angular/core';
import { Notification } from '@api/core/model/notification/notification.interface';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { AnalyticsPageView, ViewNotificationCenter, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Component({
  selector: 'tsl-notifications-inbox',
  templateUrl: './notifications-inbox.component.html',
  styleUrls: ['./notifications-inbox.component.scss'],
})
export class NotificationsInboxComponent implements OnInit {
  public notifications: Notification[] = [];
  constructor(private analyticsService: AnalyticsService, private notificationApiService: NotificationApiService) {}

  ngOnInit(): void {
    this.notifications = this.notificationApiService.getCachedContentCards();
    this.trackViewNotificationCenter();
    appboy.logContentCardsDisplayed();
  }

  public trackViewNotificationCenter(): void {
    const event: AnalyticsPageView<ViewNotificationCenter> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationCenter,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        numberOfTotalNotifications: this.notifications.length,
        numberOfUnreadNotifications: this.notifications.filter((notification) => !notification.isRead).length,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}

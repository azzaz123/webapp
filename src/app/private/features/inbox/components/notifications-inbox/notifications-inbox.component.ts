import { Component, OnInit } from '@angular/core';
import { AnalyticsPageView, ViewNotificationCenter, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Notification } from '../../core/interfaces/notification.interface';

@Component({
  selector: 'tsl-notifications-inbox',
  templateUrl: './notifications-inbox.component.html',
  styleUrls: ['./notifications-inbox.component.scss'],
})
export class NotificationsInboxComponent implements OnInit {
  public notifications: Notification[] = [];
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.trackViewNotificationCenter();
  }

  public trackViewNotificationCenter(): void {
    const event: AnalyticsPageView<ViewNotificationCenter> = {
      name: ANALYTICS_EVENT_NAMES.ViewNotificationCenter,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        numberOfTotalNotifications: this.notifications.length,
        numberOfUnreadNotifications: this.notifications.map((notification) => !notification.isRead).length,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}

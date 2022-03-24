import { Component, Input } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickNotificationCard,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import * as moment from 'moment';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { Notification } from '@api/core/model/notification/notification.interface';
import { NotificationApiService } from '@api/notification/notification-api.service';

@Component({
  selector: 'tsl-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() notification: Notification;
  public NOTIFICATION_VARIANT = NOTIFICATION_VARIANT;

  constructor(private analyticsService: AnalyticsService, private notificationApiService: NotificationApiService) {}

  public handleNotificationClick(): void {
    this.trackClickNotification();
    this.notificationApiService.logCardClick(this.notification.id);
    if (this.notification.url) {
      window.location.href = this.notification.url;
    }
  }

  public visibilityChangeHandler() {
    const { id } = this.notification;
    this.notificationApiService.logContentCard(id);
  }

  public trackClickNotification(): void {
    const { isRead, trackingId } = this.notification;
    const event: AnalyticsEvent<ClickNotificationCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickNotificationCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        notificationType: trackingId,
        isPinned: this._isPinned(),
        isUnread: !isRead,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private _isPinned(): boolean {
    return this.notification.variant === NOTIFICATION_VARIANT.PINNED;
  }

  get momentsAgo(): string {
    return moment(this.notification.date).fromNow();
  }
}

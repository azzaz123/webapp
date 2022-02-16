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
import { Notification } from '../../core/interfaces/notification.interface';

@Component({
  selector: 'tsl-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() notification: Notification;
  public NOTIFNOTIFICATION_VARIANT = NOTIFICATION_VARIANT;

  constructor(private analyticsService: AnalyticsService) {}

  public handleNotificationClick() {
    this.trackClickNotification();
  }

  public trackClickNotification(): void {
    const { variant, isRead } = this.notification;
    const event: AnalyticsEvent<ClickNotificationCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickNotificationCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.NotificationCenter,
        notificationType: variant,
        isPinned: this._isPinned(),
        isUnread: !isRead,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private _isPinned() {
    return this.notification.variant === NOTIFICATION_VARIANT.PINNED ? true : false;
  }

  get _momentsAgo() {
    return moment(this.notification.date).fromNow();
  }
}

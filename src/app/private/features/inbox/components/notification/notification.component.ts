import { Component, Input } from '@angular/core';
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
  public NOTIFICATION_VARIANT = NOTIFICATION_VARIANT;

  get momentsAgo(): string {
    return moment(this.notification.date).fromNow();
  }
}

import { Component } from '@angular/core';
import { Notification } from '../../core/interfaces/notification.interface';

@Component({
  selector: 'tsl-notifications-inbox',
  templateUrl: './notifications-inbox.component.html',
  styleUrls: ['./notifications-inbox.component.scss'],
})
export class NotificationsInboxComponent {
  public notifications: Notification[];
}

import { Component } from '@angular/core';
import { NOTIFICATION_PRODUCT_STATUS } from '../../core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { Notification } from '../../core/interfaces/notification.interface';

@Component({
  selector: 'tsl-notifications-inbox',
  templateUrl: './notifications-inbox.component.html',
  styleUrls: ['./notifications-inbox.component.scss'],
})
export class NotificationsInboxComponent {
  public notifications: Notification[];
}

import { Component, Input } from '@angular/core';
import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';
import { Notification } from '@api/core/model/notification/notification.interface';

@Component({
  selector: 'tsl-notification-image',
  templateUrl: './notification-image.component.html',
  styleUrls: ['./notification-image.component.scss'],
})
export class NotificationImageComponent {
  @Input() notification: Notification;

  public NOTIFICATION_PRODUCT_STATUS = NOTIFICATION_PRODUCT_STATUS;
  public NOTIFICATION_VARIANT = NOTIFICATION_VARIANT;
}

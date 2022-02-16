import { Component, Input } from '@angular/core';
import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';

@Component({
  selector: 'tsl-generic-image',
  templateUrl: './notification-image.component.html',
  styleUrls: ['./notification-image.component.scss'],
})
export class NotificationImageComponent {
  @Input() image: string;
  @Input() productStatus: NOTIFICATION_PRODUCT_STATUS;
  public NOTIFICATION_PRODUCT_STATUS = NOTIFICATION_PRODUCT_STATUS;

  constructor() {}
}

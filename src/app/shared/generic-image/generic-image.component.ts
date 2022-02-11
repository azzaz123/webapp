import { Component, Input } from '@angular/core';
import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';

@Component({
  selector: 'tsl-generic-image',
  templateUrl: './generic-image.component.html',
  styleUrls: ['./generic-image.component.scss'],
})
export class GenericImageComponent {
  @Input() image: string;
  @Input() productStatus?: NOTIFICATION_PRODUCT_STATUS = null;

  constructor() {}
}

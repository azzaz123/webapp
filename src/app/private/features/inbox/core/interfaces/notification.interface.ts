import { NOTIFICATION_PRODUCT_STATUS } from '../enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '../enums/notification-variant.enum';

export interface Notification {
  variant: NOTIFICATION_VARIANT;
  productStatus?: NOTIFICATION_PRODUCT_STATUS; // it can be a enum....? reserved, sold and lowered. Optional. Used only in product variant.
  isRead: boolean;
  date: Date;
  title: string;
  description: string;
}

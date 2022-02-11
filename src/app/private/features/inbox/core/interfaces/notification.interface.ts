import { NOTIFICATION_PRODUCT_STATUS } from '../enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '../enums/notification-variant.enum';

export interface Notification {
  variant: NOTIFICATION_VARIANT;
  productStatus?: NOTIFICATION_PRODUCT_STATUS;
  isRead: boolean;
  date: Date;
  title: string;
  description: string;
  photo: string;
}

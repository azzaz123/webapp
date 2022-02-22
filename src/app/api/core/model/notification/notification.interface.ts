import { NOTIFICATION_PRODUCT_STATUS } from '../../../../private/features/inbox/core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '../../../../private/features/inbox/core/enums/notification-variant.enum';

export interface Notification {
  variant: NOTIFICATION_VARIANT;
  productStatus?: NOTIFICATION_PRODUCT_STATUS;
  isRead: boolean;
  date: Date;
  title: string;
  description: string;
  image: string;
  url: string;
}

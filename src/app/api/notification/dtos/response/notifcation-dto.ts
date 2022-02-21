import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';

export interface NotificationDto {
  clicked: boolean;
  created: Date;
  description: string;
  dismissed: boolean;
  dismissible: boolean;
  expiresAt: Date;
  extras: NotificationExtraDto;
  id: string;
  imageUrl: string;
  linkText: string;
  pinned: boolean;
  title: string;
  updated: Date;
  url: string;
  viewed: boolean;
}

interface NotificationExtraDto {
  feed_type: string;
  notification_layout: string;
  notification_type: string;
  badge_state: NOTIFICATION_PRODUCT_STATUS;
}

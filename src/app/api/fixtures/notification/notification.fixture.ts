import { Notification } from '@api/core/model/notification/notification.interface';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';

export const mappedNotifications: Notification[] = [
  {
    date: new Date('2022-03-24T16:12:03.000Z'),
    description: 'Pinned pinned pinned',
    image:
      'https://braze-images.com/appboy/communication/marketing/content_cards_message_variations/images/62150af8699da6228cafe056/51c23c7f7faf7e8b25ed2613571c511dadf778fe/original.jpg?1645546235',
    isRead: false,
    productStatus: undefined,
    title: 'This is pinned!!!!!',
    url: null,
    variant: NOTIFICATION_VARIANT.PINNED,
    id: 'NjIxNTBhZjg2OTlkYTYyMjhjYWZlMDViXyRfY2M9ODk0OTFiMzYtNjA2Yy01NjJkLThmYmItMTBhNmI5Yjc4N2IxJm12PTYyMTUwYWY4Njk5ZGE2MjI4Y2FmZTA1NiZwaT1jbXA=',
  },
];

import { NOTIFICATION_LAYOUT, NotificationDto } from '@api/notification/dtos/response/notifcation-dto';

export const notificationsDtos: NotificationDto[] = [
  {
    clicked: false,
    created: null,
    description: 'Pinned pinned pinned',
    dismissed: false,
    dismissible: false,
    expiresAt: new Date('2022-03-24T16:12:03.000Z'),
    extras: {
      feed_type: 'notification_center',
      notification_type: 'notification_center',
      notification_layout: NOTIFICATION_LAYOUT.PINNED,
    },
    id: 'NjIxNTBhZjg2OTlkYTYyMjhjYWZlMDViXyRfY2M9ODk0OTFiMzYtNjA2Yy01NjJkLThmYmItMTBhNmI5Yjc4N2IxJm12PTYyMTUwYWY4Njk5ZGE2MjI4Y2FmZTA1NiZwaT1jbXA=',
    imageUrl:
      'https://braze-images.com/appboy/communication/marketing/content_cards_message_variations/images/62150af8699da6228cafe056/51c23c7f7faf7e8b25ed2613571c511dadf778fe/original.jpg?1645546235',
    linkText: '',
    pinned: true,
    title: 'This is pinned!!!!!',
    updated: new Date('2022-03-24T16:12:03.000Z'),
    url: null,
    viewed: false,
  },
  {
    clicked: false,
    created: null,
    description: 'Should not appear',
    dismissed: false,
    dismissible: false,
    expiresAt: new Date('2022-03-24T16:12:03.000Z'),
    extras: {
      feed_type: 'other_noti',
      notification_type: 'other_noti' as any,
      notification_layout: NOTIFICATION_LAYOUT.PINNED,
    },
    id: 'otherId',
    imageUrl:
      'https://braze-images.com/appboy/communication/marketing/content_cards_message_variations/images/62150af8699da6228cafe056/51c23c7f7faf7e8b25ed2613571c511dadf778fe/original.jpg?1645546235',
    linkText: '',
    pinned: true,
    title: 'This is pinned!!!!!',
    updated: new Date('2022-03-24T16:12:03.000Z'),
    url: null,
    viewed: false,
  },
];

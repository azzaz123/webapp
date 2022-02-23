import { Injectable } from '@angular/core';
import { mapNotificationsFromBraze } from './mappers/notification-mapper';
import { Notification } from '@api/core/model/notification/notification.interface';

@Injectable()
export class NotificationApiService {
  public constructor() {}

  public getCachedContentCards(): Notification[] {
    const brazeNotifications = window['appboy'].getCachedContentCards();
    console.log('braze => ', brazeNotifications);
    const mappedNotifications = mapNotificationsFromBraze(brazeNotifications.cards);
    console.log('mapped => ', mappedNotifications);
    return mappedNotifications;
  }
}

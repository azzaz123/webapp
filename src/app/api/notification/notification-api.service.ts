import { Injectable } from '@angular/core';
import { mapNotificationsFromBraze } from './mappers/notification-mapper';
import { Notification } from '@api/core/model/notification/notification.interface';

@Injectable()
export class NotificationApiService {
  public getNotifications(): Notification[] {
    const brazeNotifications = appboy.getCachedContentCards();
    return mapNotificationsFromBraze(brazeNotifications.cards);
  }
}

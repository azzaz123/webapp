import { Injectable } from '@angular/core';
import { NotificationsHttpService } from '@api/notifications/http/notifications-http.service';
import { mapNotificationsFromBraze } from './mappers/notification-mapper';
import { Notification } from '@api/core/model/notification/notification.interface';

@Injectable()
export class NotificationApiService {
  public constructor(private httpService: NotificationsHttpService) {}

  public getCachedContentCards(): Notification[] {
    const brazeNotifications = window['appboy'].getCachedContentCards();
    console.log('braze => ', brazeNotifications);
    const mappedNotifications = mapNotificationsFromBraze(brazeNotifications.cards);
    console.log('mapped => ', mappedNotifications);
    return mappedNotifications;
  }
}

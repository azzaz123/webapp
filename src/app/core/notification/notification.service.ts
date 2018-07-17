import { Injectable } from '@angular/core';
import { TrackingService } from '../tracking/tracking.service';
import { I18nService } from '../i18n/i18n.service';
import { Message } from '../message/message';
import { PLACEHOLDER_AVATAR } from '../user/user';
import { PushNotificationsService } from 'ng-push';

export const NOTIFICATION_DURATION = 4000;

@Injectable()
export class NotificationService {

  private hidden = false;

  constructor(private notificationService: PushNotificationsService,
              private trackingService: TrackingService,
              private i18n: I18nService) {
  }

  public init() {
    this.notificationService.requestPermission();
    Visibility.change(() => {
      this.hidden = Visibility.hidden();
    });
  }

  public sendBrowserNotification(message: Message, itemId: string) {
    if (this.hidden) {
      this.notificationService.create(this.i18n.getTranslations('newMessageNotification') + message.user.microName, {
        body: message.message,
        icon: message.user.image ? message.user.image.urls_by_size.medium : PLACEHOLDER_AVATAR
      }).subscribe((event: any) => {
        this.trackingService.track(TrackingService.NOTIFICATION_RECEIVED, {
          thread_id: message.conversationId,
          item_id: itemId,
          message_id: message.id
        });
        setTimeout(() => {
          event.notification.close();
        }, NOTIFICATION_DURATION);
      });
    }
  }

}

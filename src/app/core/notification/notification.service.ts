import { Injectable } from '@angular/core';
import { TrackingService } from '../tracking/tracking.service';
import { I18nService } from '../i18n/i18n.service';
import { PLACEHOLDER_AVATAR } from '../user/user';
import { InboxMessage, InboxConversation } from 'app/chat/model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const ASK_PERMISSIONS_TIMEOUT_MS = 5000;

@Injectable()
export class NotificationService {

  private showNotifications = false;

  constructor(
    private trackingService: TrackingService,
    private i18n: I18nService) {
  }

  public init(): void {
    if (this.canShowNotifications()) {
      return;
    }
    this.askForPermissions();
  }

  public sendFromInboxMessage(message: InboxMessage, conversation: InboxConversation) {
    if (!this.canShowNotifications()) {
      return;
    }
    const notification = this.createFromInboxMessage(message, conversation);
    notification.addEventListener('close', () => this.trackNotificationRecieved(message));
  }

  // Delaying the request due to browsers recommendation
  private askForPermissions(): void {
    of({}).pipe(delay(ASK_PERMISSIONS_TIMEOUT_MS)).subscribe(() => {
      Notification.requestPermission().then(permission => {
        this.showNotifications = permission === 'granted';
      });
    });
  }

  private browserSupportsNotifications(): boolean {
    return !!Notification;
  }

  private canShowNotifications(): boolean {
    return this.showNotifications && this.browserSupportsNotifications();
  }

  private createFromInboxMessage(message: InboxMessage, conversation: InboxConversation): Notification {
    return new Notification(
      this.buildTitleFromConversation(conversation),
      this.buildOptionsFromConversation(message, conversation)
    );
  }

  private buildTitleFromConversation(conversation: InboxConversation): string {
    return `${this.i18n.getTranslations('newMessageNotification')}${conversation.user.microName}`;
  }

  private buildOptionsFromConversation(message: InboxMessage, conversation: InboxConversation): NotificationOptions {
    const image = conversation.user.avatarUrl || PLACEHOLDER_AVATAR;

    return {
      body: message.text,
      icon: image,
      image,
      badge: image,
      timestamp: message.date.getTime()
    };
  }

  private trackNotificationRecieved(message: InboxMessage) {
    this.trackingService.track(TrackingService.NOTIFICATION_RECEIVED, {
      thread_id: message.thread,
      message_id: message.id
    });
  }

}

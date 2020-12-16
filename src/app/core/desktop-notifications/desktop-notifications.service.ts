import { Injectable } from '@angular/core';
import { InboxConversation, InboxMessage } from '@features/chat/core/model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { I18nService } from '../i18n/i18n.service';
import { TrackingService } from '../tracking/tracking.service';
import { PLACEHOLDER_AVATAR } from '../user/user';

export const ASK_PERMISSIONS_TIMEOUT_MS = 5000;

@Injectable()
export class DesktopNotificationsService {
  private showNotifications = false;

  constructor(
    private trackingService: TrackingService,
    private i18n: I18nService
  ) {}

  public init(): void {
    if (!this.browserSupportsNotifications() || this.showNotifications) {
      return;
    }
    this.askForPermissions();
  }

  public sendFromInboxMessage(
    message: InboxMessage,
    conversation: InboxConversation
  ): void {
    if (!this.canShowNotifications()) {
      return;
    }
    const notification = this.createFromInboxMessage(message, conversation);
    notification.addEventListener('close', () =>
      this.trackNotificationReceived(message)
    );
  }

  public browserSupportsNotifications(): boolean {
    return (
      'Notification' in window &&
      !!Notification &&
      !!Notification.requestPermission
    );
  }

  public canShowNotifications(): boolean {
    return (
      this.showNotifications &&
      this.browserSupportsNotifications() &&
      this.documentIsHidden()
    );
  }

  private documentIsHidden(): boolean {
    return document.visibilityState === 'hidden';
  }

  // Delaying the request due to browsers recommendation
  private askForPermissions(): void {
    of({})
      .pipe(delay(ASK_PERMISSIONS_TIMEOUT_MS))
      .subscribe(() => {
        Notification.requestPermission().then((permission) => {
          this.showNotifications = permission === 'granted';
        });
      });
  }

  private createFromInboxMessage(
    message: InboxMessage,
    conversation: InboxConversation
  ): Notification {
    return new Notification(
      this.buildTitleFromConversation(conversation),
      this.buildOptionsFromConversation(message, conversation)
    );
  }

  private buildTitleFromConversation(conversation: InboxConversation): string {
    return `${this.i18n.getTranslations('newMessageNotification')}${
      conversation.user.microName
    }`;
  }

  private buildOptionsFromConversation(
    message: InboxMessage,
    conversation: InboxConversation
  ): NotificationOptions {
    const image = conversation.user.avatarUrl || PLACEHOLDER_AVATAR;

    return {
      body: message.text,
      icon: image,
      image,
      badge: image,
      timestamp: message.date.getTime(),
    };
  }

  private trackNotificationReceived(message: InboxMessage): void {
    this.trackingService.track(TrackingService.NOTIFICATION_RECEIVED, {
      thread_id: message.thread,
      message_id: message.id,
    });
  }
}

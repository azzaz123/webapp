import { Injectable } from '@angular/core';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { InboxConversation, InboxMessage } from '@private/features/chat/core/model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { I18nService } from '../i18n/i18n.service';
import { PLACEHOLDER_AVATAR } from '../user/user';

export const ASK_PERMISSIONS_TIMEOUT_MS = 5000;
type NotificationsPermissionStatus = 'granted' | 'denied' | 'default';

@Injectable()
export class DesktopNotificationsService {
  private showNotifications = false;

  constructor(private i18n: I18nService) {}

  public init(): void {
    if (!this.browserSupportsNotifications() || this.showNotifications) {
      return;
    }
    this.askForPermissions();
  }

  public sendFromInboxMessage(message: InboxMessage, conversation: InboxConversation): void {
    if (!this.canShowNotifications()) {
      return;
    }
    this.createFromInboxMessage(message, conversation);
  }

  public browserSupportsNotifications(): boolean {
    return 'Notification' in window && !!Notification && !!Notification.requestPermission;
  }

  public canShowNotifications(): boolean {
    return this.showNotifications && this.browserSupportsNotifications() && this.documentIsHidden();
  }

  private documentIsHidden(): boolean {
    return document.visibilityState === 'hidden';
  }

  // Delaying the request due to browsers recommendation
  private askForPermissions(): void {
    of({})
      .pipe(delay(ASK_PERMISSIONS_TIMEOUT_MS))
      .subscribe(() => {
        this.requestBrowserNotificationsPermission();
      });
  }

  private requestBrowserNotificationsPermission(): void {
    try {
      Notification.requestPermission().then((permission) => {
        this.setShowNotifications(permission);
      });
    } catch (error) {
      if (error instanceof TypeError) {
        Notification.requestPermission((permission) => {
          this.setShowNotifications(permission);
        });
      }
    }
  }

  private setShowNotifications(permission: NotificationsPermissionStatus) {
    if (permission === 'granted') {
      this.showNotifications = true;
    }
  }

  private createFromInboxMessage(message: InboxMessage, conversation: InboxConversation): Notification {
    try {
      return new Notification(this.buildTitleFromConversation(conversation), this.buildOptionsFromConversation(message, conversation));
    } catch (error) {
      return;
    }
  }

  private buildTitleFromConversation(conversation: InboxConversation): string {
    return `${this.i18n.translate(TRANSLATION_KEY.CHAT_DESKTOP_NOTIFICATION_TITLE)} ${conversation.user.microName}`;
  }

  private buildOptionsFromConversation(message: InboxMessage, conversation: InboxConversation): NotificationOptions {
    const image = conversation.user.avatarUrl || PLACEHOLDER_AVATAR;

    return {
      body: message.text,
      icon: image,
      image,
      badge: image,
      timestamp: message.date.getTime(),
    };
  }
}

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { InboxConversation, InboxMessage, MessageStatus, MessageType } from '@private/features/chat/core/model';
import { createInboxConversationsArray } from '../../../tests/inbox.fixtures.spec';
import { I18nService } from '../i18n/i18n.service';
import { ASK_PERMISSIONS_TIMEOUT_MS, DesktopNotificationsService } from './desktop-notifications.service';

export class MockDesktopNotifications {
  public init(): void {}

  public sendFromInboxMessage(_message: InboxMessage, _conversation: InboxConversation): void {}

  public browserSupportsNotifications(): boolean {
    return true;
  }

  public canShowNotifications(): boolean {
    return true;
  }
}

describe('Service: DesktopNotifications', () => {
  let service: DesktopNotificationsService;
  let i18nService: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesktopNotificationsService, I18nService],
    });
    service = TestBed.inject(DesktopNotificationsService);
    i18nService = TestBed.inject(I18nService);
  });

  describe('when setting up the notifications', () => {
    describe('and when user has not allowed notifications yet', () => {
      beforeEach(() => {
        spyOn(Notification, 'requestPermission').and.callThrough();
      });

      it('should ask user consent for permissions', fakeAsync(() => {
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);

        expect(Notification.requestPermission).toHaveBeenCalledTimes(1);
      }));
    });

    describe('and when user previously did not allow notifications', () => {
      beforeEach(fakeAsync(() => {
        spyOn(Notification, 'requestPermission').and.returnValue(Promise.resolve('denied'));
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);
      }));

      it('should ask again for notifications permissions', fakeAsync(() => {
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);

        expect(Notification.requestPermission).toHaveBeenCalledTimes(2);
      }));
    });

    describe('and when user previously did allow notifications', () => {
      beforeEach(fakeAsync(() => {
        spyOn(Notification, 'requestPermission').and.returnValue(Promise.resolve('granted'));
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);
      }));

      it('should not ask again for notifications permissions', fakeAsync(() => {
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);

        expect(Notification.requestPermission).toHaveBeenCalledTimes(1);
      }));
    });

    describe('and when the browser does not support notifications', () => {
      beforeEach(() => {
        spyOn(service, 'browserSupportsNotifications').and.returnValue(false);
        spyOn(Notification, 'requestPermission');
      });

      it('should not ask for notifications permissions', fakeAsync(() => {
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);

        expect(Notification.requestPermission).not.toHaveBeenCalled();
      }));
    });
  });

  describe('when checking if browser supports notifications', () => {
    describe('and when browser supports them', () => {
      it('should notify compatibility', () => {
        expect(service.browserSupportsNotifications()).toBe(true);
      });
    });

    describe('and when browser does not support them', () => {
      beforeEach(() => spyOn(window, 'Notification').and.callFake(() => null));

      it('should notify no compatibility', () => {
        expect(service.browserSupportsNotifications()).toBe(false);
      });
    });
  });

  describe('when sending a notification from an inbox message', () => {
    let conversation: InboxConversation;
    let message: InboxMessage;

    beforeEach(() => {
      conversation = createInboxConversationsArray(1)[0];
      conversation.user.avatarUrl = 'avatarUrl';
      message = new InboxMessage('mockId', conversation.id, 'hola!', 'mockUserId', false, new Date(), MessageStatus.SENT, MessageType.TEXT);
    });

    describe('and when browser does not support notifications', () => {
      beforeEach(() => spyOn(window, 'Notification').and.callFake(() => null));

      it('should not send notification', fakeAsync(() => {
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);
        service.sendFromInboxMessage(message, conversation);

        expect(Notification).not.toHaveBeenCalled();
      }));
    });

    describe('and when user is currently seeing the webpage', () => {
      beforeEach(() => {
        const notificationSpy = spyOn(window, 'Notification').and.callFake(() => {
          return {
            addEventListener: () => {},
          };
        });
        notificationSpy['requestPermission'] = () => Promise.resolve('granted');
        notificationSpy['addEventListener'] = () => {};
      });

      it('should not send notification', fakeAsync(() => {
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);
        service.sendFromInboxMessage(message, conversation);

        expect(Notification).not.toHaveBeenCalled();
      }));
    });

    describe('and when user did not accept notifications', () => {
      beforeEach(fakeAsync(() => {
        spyOn(Notification, 'requestPermission').and.returnValue(Promise.resolve('denied'));
        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);

        spyOn(window, 'Notification').and.callFake(() => null);
      }));

      it('should not send notification', fakeAsync(() => {
        service.sendFromInboxMessage(message, conversation);

        expect(Notification).not.toHaveBeenCalled();
      }));
    });

    describe('and when user accepted notifications', () => {
      const mockNotification = {
        _mockEventListeners: {},
        addEventListener: (key: string, value: Function) => (mockNotification._mockEventListeners[key] = value),
      };

      beforeEach(fakeAsync(() => {
        spyOn(service, 'canShowNotifications').and.returnValue(true);
        spyOn(window, 'Notification').and.callFake(() => mockNotification);
      }));

      it('should send notification', () => {
        const expectedTitle = `${i18nService.translate(TRANSLATION_KEY.CHAT_DESKTOP_NOTIFICATION_TITLE)} ${conversation.user.microName}`;
        const image = conversation.user.avatarUrl;
        const expectedNotificationOptions = {
          body: message.text,
          icon: image,
          image,
          badge: image,
          timestamp: message.date.getTime(),
        };

        service.sendFromInboxMessage(message, conversation);

        expect(Notification).toHaveBeenCalledWith(expectedTitle, expectedNotificationOptions);
      });
    });
  });
});

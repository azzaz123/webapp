import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DesktopNotificationsService, ASK_PERMISSIONS_TIMEOUT_MS } from './desktop-notifications.service';
import { TrackingService } from '../tracking/tracking.service';
import { I18nService } from '../i18n/i18n.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { createInboxConversationsArray } from '../../../tests/inbox.fixtures.spec';
import { InboxConversation, InboxMessage, MessageType, MessageStatus } from '../../../app/chat/model';

export class MockDesktopNotifications {
  public init(): void {
  }

  public sendFromInboxMessage(_message: InboxMessage, _conversation: InboxConversation): void {
  }

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
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DesktopNotificationsService,
        I18nService,
        { provide: TrackingService, useClass: MockTrackingService },
      ]
    });
    service = TestBed.inject(DesktopNotificationsService);
    i18nService = TestBed.inject(I18nService);
    trackingService = TestBed.inject(TrackingService);
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
      message = new InboxMessage('mockId', conversation.id, 'hola!', 'mockUserId', false, new Date(),
      MessageStatus.SENT, MessageType.TEXT);
    });

    describe('and when browser does not support notifications', () => {
      beforeEach(() => spyOn(service, 'browserSupportsNotifications').and.returnValue(false));

      it('should not send notification', fakeAsync(() => {
        spyOn(window, 'Notification').and.callFake(() => null);

        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);
        service.sendFromInboxMessage(message, conversation);

        expect(Notification).not.toHaveBeenCalled();
      }));
    });

    describe('and when user did not accept notifications', () => {
      beforeEach(() => {
        spyOn(Notification, 'requestPermission').and.returnValue(Promise.resolve('denied'));
      });

      it('should not send notification', fakeAsync(() => {
        spyOn(window, 'Notification').and.callFake(() => null);

        service.init();
        tick(ASK_PERMISSIONS_TIMEOUT_MS);
        service.sendFromInboxMessage(message, conversation);

        expect(Notification).not.toHaveBeenCalled();
      }));
    });

    describe('and when user accepted notifications', () => {
      const mockNotification = {
        _mockEventListeners: {},
        addEventListener: (key: string, value: Function) => mockNotification._mockEventListeners[key] = value
      };

      beforeEach(fakeAsync(() => {
        spyOn(service, 'canShowNotifications').and.returnValue(true);
        spyOn(window, 'Notification').and.callFake(() => mockNotification);
      }));

      it('should send notification', () => {
        const expectedTitle = `${i18nService.getTranslations('newMessageNotification')}${conversation.user.microName}`;
        const image = conversation.user.avatarUrl;
        const expectedNotificationOptions = {
          body: message.text,
          icon: image,
          image,
          badge: image,
          timestamp: message.date.getTime()
        };

        service.sendFromInboxMessage(message, conversation);

        expect(Notification).toHaveBeenCalledWith(expectedTitle, expectedNotificationOptions);
      });

      describe('and when user closes notification', () => {
        it('should track the event', () => {
          service.sendFromInboxMessage(message, conversation);
          spyOn(trackingService, 'track');
          const expectedEvent = [
            TrackingService.NOTIFICATION_RECEIVED,
            {
              thread_id: message.thread,
              message_id: message.id
            }
          ];

          mockNotification._mockEventListeners['close']();

          expect(trackingService.track).toHaveBeenCalledWith(...expectedEvent);
        });
      });
    });
  });
});

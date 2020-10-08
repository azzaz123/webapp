/* tslint:disable:no-unused-variable */


import { of } from 'rxjs';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NOTIFICATION_DURATION, NotificationService } from './notification.service';
import { TrackingService } from '../tracking/tracking.service';
import { I18nService } from '../i18n/i18n.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { Message } from '../message/message';
import { MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { MOCK_USER, USER_DATA } from '../../../tests/user.fixtures.spec';
import { PLACEHOLDER_AVATAR, User } from '../user/user';
import { MOCK_ITEM } from '../../../tests/item.fixtures.spec';

let service: NotificationService;
let notification: PushNotificationsService;
let trackingService: TrackingService;

class MockedPushNotificationsService {
  requestPermission() {
  }

  create() {
  }
}

describe('Service: Notification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        I18nService,
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: PushNotificationsService, useClass: MockedPushNotificationsService}
      ]
    });
    service = TestBed.inject(NotificationService);
    notification = TestBed.inject(PushNotificationsService);
    trackingService = TestBed.inject(TrackingService);

  });

  describe('init', () => {

    it('should listen to visibility event and set hidden', () => {
      spyOn(Visibility, 'change').and.callFake((callback: Function) => callback());
      spyOn(Visibility, 'hidden').and.returnValue(true);
      service.init();
      expect(Visibility.change).toHaveBeenCalled();
      expect(service['hidden']).toBe(true);
    });

    it('should call requestPermission', () => {
      spyOn(notification, 'requestPermission');
      service.init();
      expect(notification.requestPermission).toHaveBeenCalled();
    });

  });

  describe('sendBrowserNotification', () => {

    let message: Message;
    const MOCKED_NOTIFICATION: any = {
      notification: {
        close() {
        }
      }
    };

    beforeEach(() => {
      spyOn(MOCKED_NOTIFICATION.notification, 'close');
      spyOn(notification, 'create').and.returnValue(of(MOCKED_NOTIFICATION));
      message = MOCK_MESSAGE;
      message.user = MOCK_USER;
    });

    describe('if hidden', () => {
      beforeEach(() => {
        service['hidden'] = true;
      });

      it('should create a notification if browser is hidden', () => {
        service.sendBrowserNotification(MOCK_MESSAGE, MOCK_ITEM.id);
        expect(notification.create).toHaveBeenCalledWith('New message from ' + message.user.microName, {
          body: message.message,
          icon: message.user.image.urls_by_size.medium
        });
      });

      it('should create a notification with placeholder image if no user image', () => {
        message.user = new User(
          USER_DATA.id,
          USER_DATA.micro_name
        );
        service.sendBrowserNotification(message, MOCK_ITEM.id);
        expect(notification.create).toHaveBeenCalledWith('New message from ' + USER_DATA.micro_name, {
          body: message.message,
          icon: PLACEHOLDER_AVATAR
        });
      });

      it('should close the notification after creating', fakeAsync(() => {
        service.sendBrowserNotification(MOCK_MESSAGE, MOCK_ITEM.id);
        tick(NOTIFICATION_DURATION + 1000);
        expect(MOCKED_NOTIFICATION.notification.close).toHaveBeenCalled();
      }));
      it('should track the MessageNotified event', fakeAsync(() => {
        spyOn(trackingService, 'track');
        service.sendBrowserNotification(MOCK_MESSAGE, MOCK_ITEM.id);
        tick(NOTIFICATION_DURATION + 1000);
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.NOTIFICATION_RECEIVED,
          { thread_id: MOCK_MESSAGE.thread,
            message_id: MOCK_MESSAGE.id });
      }));
    });

    describe('if visible', () => {

      it('should not create a notification if browser is visible', () => {
        service['hidden'] = false;
        service.sendBrowserNotification(MOCK_MESSAGE, MOCK_ITEM.id);
        expect(notification.create).not.toHaveBeenCalled();
      });

    });


  });

});

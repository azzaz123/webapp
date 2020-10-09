import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DesktopNotificationsService, ASK_PERMISSIONS_TIMEOUT_MS } from './desktop-notifications.service';
import { TrackingService } from '../tracking/tracking.service';
import { I18nService } from '../i18n/i18n.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';

describe('Service: DesktopNotifications', () => {
  let service: DesktopNotificationsService;
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
});

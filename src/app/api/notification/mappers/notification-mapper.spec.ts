import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { mapNotificationsFromBraze } from '@api/notification/mappers/notification-mapper';
import { mappedNotifications } from '@api/fixtures/notification/notification.fixture';
import { notificationsDtos } from '@api/fixtures/notification/notification-response.fixture';

describe('NotificationsMapper', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [],
        declarations: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  describe('mapNotificationFromBraze', () => {
    it('should map', () => {
      const items = mapNotificationsFromBraze(notificationsDtos);
      expect(items).toEqual(mappedNotifications);
    });
  });
});

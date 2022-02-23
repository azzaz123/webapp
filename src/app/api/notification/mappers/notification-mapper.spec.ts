import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { mapNotificationsFromBraze } from '@api/notification/mappers/notification-mapper';
import { mappedNotification } from '@api/fixtures/notification/notification.fixture';
import { notificationsDto } from '@api/fixtures/notification/notification-response.fixture';

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
      const items = mapNotificationsFromBraze(notificationsDto);
      expect(items).toEqual(mappedNotification);
    });
  });
});

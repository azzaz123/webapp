import { TestBed } from '@angular/core/testing';
import { NotificationApiService } from './notification-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExternalCommsService } from '@core/external-comms.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@core/user/user.service';
import { notificationsDtos } from '@api/fixtures/notification/notification-response.fixture';
import { NOTIFICATION_LAYOUT, NotificationDto } from '@api/notification/dtos/response/notifcation-dto';
import { Notification } from '@api/core/model/notification/notification.interface';
import { mappedNotifications } from '@api/fixtures/notification/notification.fixture';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';
import { AppboyContentCards } from '@core/communication/vendors/appboy.interface';

describe('NotificationApiService', () => {
  let service: NotificationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationApiService,
        {
          provide: ExternalCommsService,
          useValue: {
            brazeReady$: new BehaviorSubject(true),
          },
        },
        {
          provide: UserService,
          useValue: {
            isLogged: true,
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NotificationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: This could be decently mocked
  beforeEach(() => {
    spyOn(appboy, 'requestContentCardsRefresh');
    spyOn(appboy, 'getCachedContentCards').and.returnValue({ cards: notificationsDtos });
    spyOn(appboy, 'logContentCardsDisplayed');
    spyOn(appboy, 'logCardImpressions');
    spyOn(appboy, 'logCardClick');
    spyOn(appboy, 'requestImmediateDataFlush');
  });

  describe('When asked to refresh notifications', () => {
    it('should ask appboy to refresh content cards', () => {
      service.refreshNotifications();
      expect(appboy.requestContentCardsRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('When asked to log that notification center is displayed to the user', () => {
    it('should inform appboy', () => {
      service.logContentCard(notificationsDtos[0].id);
      expect(appboy.logCardImpressions).toHaveBeenCalledTimes(1);
      expect(appboy.logCardImpressions).toHaveBeenCalledWith([notificationsDtos[0]], true);
    });
  });

  describe('When asked to log card click', () => {
    it('should inform appboy', () => {
      service.logCardClick(notificationsDtos[0].id);
      expect(appboy.logCardClick).toHaveBeenCalledTimes(1);
      expect(appboy.logCardClick).toHaveBeenCalledWith(notificationsDtos[0], true);
      expect(appboy.requestImmediateDataFlush).toHaveBeenCalledTimes(1);
    });
  });

  describe('When new cards appear', () => {
    it('should update subjects', () => {
      const newNotification: NotificationDto = {
        clicked: false,
        created: null,
        description: 'stuff',
        dismissed: false,
        dismissible: false,
        expiresAt: new Date('2022-03-24T16:12:03.000Z'),
        extras: {
          feed_type: 'notification_center',
          notification_type: 'trackingId',
          notification_layout: NOTIFICATION_LAYOUT.PINNED,
        },
        id: 'newNotification=',
        imageUrl: 'no',
        linkText: '',
        pinned: true,
        title: 'stuff',
        updated: new Date('2022-03-24T16:12:03.000Z'),
        url: 'https://es.wallapop.com',
        viewed: false,
      };

      const newMappedNotification: Notification = {
        isRead: false,
        id: newNotification.id,
        url: 'https://es.wallapop.com',
        description: 'stuff',
        title: 'stuff',
        image: 'no',
        date: new Date('2022-03-24T16:12:03.000Z'),
        variant: NOTIFICATION_VARIANT.PINNED,
        trackingId: 'trackingId',
      };

      let notifications: Notification[];
      let notificationsCount: number;
      let unreadNotificationsCount: number;

      service.notifications$.subscribe((notis) => (notifications = notis));
      service.notificationsCount$.subscribe((count) => (notificationsCount = count));
      service.unreadNotificationsCount$.subscribe((count) => (unreadNotificationsCount = count));

      service['handleContentCardUpdates']({ cards: [...notificationsDtos, newNotification] } as AppboyContentCards);

      expect(notifications).toEqual([...mappedNotifications, newMappedNotification]);
      expect(notificationsCount).toEqual(2);
      expect(unreadNotificationsCount).toEqual(2);
    });
  });
});

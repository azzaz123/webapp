import { TestBed } from '@angular/core/testing';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { BehaviorSubject } from 'rxjs';
import { BOTTOM_NAVIGATION_BAR_ELEMENTS } from '../constants/bottom-navigation-bar-elements';
import { BottomNavigationBarService } from './bottom-navigation-bar.service';

describe('BottomNavigationBarService', () => {
  let service: BottomNavigationBarService;
  let unreadChatMessagesSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  let unreadNotificationsSubject: BehaviorSubject<number> = new BehaviorSubject(0);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BottomNavigationBarService,
        {
          provide: UnreadChatMessagesService,
          useValue: {
            totalUnreadMessages$: unreadChatMessagesSubject.asObservable(),
          },
        },
        {
          provide: NotificationApiService,
          useValue: {
            unreadNotificationsCount$: unreadNotificationsSubject.asObservable(),
          },
        },
      ],
    });
    service = TestBed.inject(BottomNavigationBarService);
  });

  describe('when hiding the navigation bar', () => {
    it('the state should be hidden', (done) => {
      service.hideNavigationBar();

      service.hidden$.subscribe((hidden) => {
        expect(hidden).toBe(true);
        done();
      });
    });
  });

  describe('when showing the navigation bar', () => {
    it('the state should be visible', (done) => {
      service.showNavigationBar();

      service.hidden$.subscribe((hidden) => {
        expect(hidden).toBe(false);
        done();
      });
    });
  });

  describe('when there are unread chat messages', () => {
    it('should show the pending notification indicator in the inbox tab', (done) => {
      unreadChatMessagesSubject.next(5);
      unreadNotificationsSubject.next(0);

      service.navigationElements$.subscribe((elements) => {
        expect(elements[BOTTOM_NAVIGATION_BAR_ELEMENTS.INBOX].pendingNotification).toBe(true);
        done();
      });
    });
  });

  describe('when there are pending inbox notifications', () => {
    it('should show the pending notification indicator in the inbox tab', (done) => {
      unreadChatMessagesSubject.next(0);
      unreadNotificationsSubject.next(5);

      service.navigationElements$.subscribe((elements) => {
        expect(elements[BOTTOM_NAVIGATION_BAR_ELEMENTS.INBOX].pendingNotification).toBe(true);
        done();
      });
    });
  });
});

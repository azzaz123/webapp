import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ConnectionService } from '@core/connection/connection.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { RemoteConsoleService } from '@core/remote-console';
import { TrackingService } from '@core/tracking/tracking.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { XmppService } from '@core/xmpp/xmpp.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockRemoteConsoleService } from '@fixtures/remote-console.fixtures.spec';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';

describe('Service: Message', () => {
  let service: UnreadChatMessagesService;
  let userService: UserService;
  let connectionService: ConnectionService;
  let trackingService: TrackingService;
  let i18n: I18nService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnreadChatMessagesService,
        XmppService,
        EventService,
        I18nService,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: ConnectionService, useValue: {} },
        { provide: UserService, useValue: { user: new User(USER_ID) } },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
      ],
    });
    service = TestBed.inject(UnreadChatMessagesService);
    userService = TestBed.inject(UserService);
    connectionService = TestBed.inject(ConnectionService);
    trackingService = TestBed.inject(TrackingService);
    eventService = TestBed.inject(EventService);
    i18n = TestBed.inject(I18nService);
  });

  it('should instanciate', () => {
    expect(service).toBeTruthy();
  });

  describe('totalUnreadMessages', () => {
    it('should notify changes when totalUnreadMessages change', () => {
      let changedValue: number;
      const VALUE = 100;
      service.totalUnreadMessages$.subscribe((totalUnreadMessages: number) => {
        changedValue = totalUnreadMessages;
      });
      service.totalUnreadMessages = VALUE;
      expect(changedValue).toBe(VALUE);
      expect(service.totalUnreadMessages).toBe(VALUE);
    });
  });
});

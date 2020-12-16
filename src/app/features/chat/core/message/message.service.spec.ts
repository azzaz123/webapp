import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ConnectionService } from '@core/connection/connection.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { RealTimeService } from '@core/message/real-time.service';
import { RemoteConsoleService } from '@core/remote-console';
import { TrackingService } from '@core/tracking/tracking.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { XmppService } from '@core/xmpp/xmpp.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/inbox.fixtures.spec';
import { MockRemoteConsoleService } from '@fixtures/remote-console.fixtures.spec';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { InboxConversation } from '../model';
import { MessageService } from './message.service';

describe('Service: Message', () => {
  let realTime: RealTimeService;
  let service: MessageService;
  let userService: UserService;
  let connectionService: ConnectionService;
  let trackingService: TrackingService;
  let i18n: I18nService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        XmppService,
        EventService,
        I18nService,
        RealTimeService,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: ConnectionService, useValue: {} },
        { provide: UserService, useValue: { user: new User(USER_ID) } },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
      ],
    });
    realTime = TestBed.inject(RealTimeService);
    service = TestBed.inject(MessageService);
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

  describe('send', () => {
    it('should call the send message', () => {
      spyOn(realTime, 'sendMessage');
      const conversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      service.send(conversation, 'text');
      expect(realTime.sendMessage).toHaveBeenCalledWith(conversation, 'text');
    });
  });
});

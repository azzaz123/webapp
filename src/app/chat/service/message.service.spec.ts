/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { XmppService } from '../../core/xmpp/xmpp.service';
import { Conversation } from '../../core/conversation/conversation';
import { Message } from '../../core/message/message';
import { EventService } from '../../core/event/event.service';
import { createMessagesArray, MESSAGE_MAIN } from '../../../tests/message.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ConnectionService } from '../../core/connection/connection.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { RealTimeService } from '../../core/message/real-time.service';
import { RemoteConsoleService } from '../../core/remote-console';
import { MockRemoteConsoleService } from '../../../tests';
import { InboxConversation, MessageStatus } from '../model';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';
import { AnalyticsService } from "../../core/analytics/analytics.service";
import { MockAnalyticsService } from "../../../tests/analytics.fixtures.spec";

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
        { provide: AnalyticsService, useClass: MockAnalyticsService }
      ]
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

  describe('createPhoneNumberMessage', () => {
    const phone = '+34912345678';
    const conversation = MOCK_CONVERSATION();

    beforeEach(() => {
      spyOn(realTime, 'sendMessage');
    });

    it('should call realTime.sendMessage with the new message', () => {
      const phoneMsg: any = i18n.getTranslations('phoneMessage') + phone;

      service.createPhoneNumberMessage(conversation, phone);

      expect(realTime.sendMessage).toHaveBeenCalledWith(conversation, phoneMsg);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { InboxService } from './inbox.service';
import { MessageService } from '../message/message.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { HttpService } from '../http/http.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { Observable } from 'rxjs';
import { MOCK_INBOX_API_RESPONSE } from '../../../tests/inbox.fixtures.spec';
import { ResponseOptions, Response } from '@angular/http';
import { TrackingService } from '../tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { MockMessageService } from '../../../tests/message.fixtures.spec';
import { FeatureflagService } from '../user/featureflag.service';
import { EventService } from '../event/event.service';
import { Message } from '../message/message';

let service: InboxService;
let http: HttpService;
let persistencyService: PersistencyService;
let messageService: MessageService;
let featureflagService: FeatureflagService;
let eventService: EventService;

describe('InboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InboxService,
        ...TEST_HTTP_PROVIDERS,
        EventService,
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: FeatureflagService, useValue: {
          getFlag() {
            return Observable.of(false);
          }
        }}
      ]
    });
    service = TestBed.get(InboxService);
    http = TestBed.get(HttpService);
    persistencyService = TestBed.get(PersistencyService);
    messageService = TestBed.get(MessageService);
    featureflagService = TestBed.get(FeatureflagService);
    eventService = TestBed.get(EventService);
  });

  describe('getInboxFeatureFlag', () => {
    it('should call featureflagService.getFlag when called', () => {
      spyOn(featureflagService, 'getFlag');

      service.getInboxFeatureFlag();

      expect(featureflagService.getFlag).toHaveBeenCalledWith('web_inbox_projections');
    });
  });

  describe('init', () => {
    const res: Response = new Response (new ResponseOptions({body: MOCK_INBOX_API_RESPONSE}));
    let parsedConversaitonsResponse;
    beforeEach(() => {
      spyOn(http, 'get').and.returnValue(Observable.of(res));
      parsedConversaitonsResponse = service['buildConversations'](JSON.parse(MOCK_INBOX_API_RESPONSE).conversations);
    });

    it('should subscribe to the NEW_MESSAGE and CHAT_SIGNAL events', () => {
      spyOn(eventService, 'subscribe');
      const eventServiceSubscribeArgs = [];

      service.init();
      eventService.subscribe['calls'].allArgs().map(call => eventServiceSubscribeArgs.push(call[0]));

      expect(eventServiceSubscribeArgs).toContain(EventService.NEW_MESSAGE);
      expect(eventServiceSubscribeArgs).toContain(EventService.CHAT_SIGNAL);
    });

    it('should make an HTTP get request to get the inbox', () => {
      service.init();

      expect(http.get).toHaveBeenCalledWith(service['API_URL']);
    });

    it('should set the number of unreadMessages in messageService', () => {
      spyOn(messageService, 'totalUnreadMessages');
      let expectedUnreadCount = 0;
      res.json().conversations.filter(c => c.unread_messages).map(c => expectedUnreadCount += + c.unread_messages);

      service.init();

      expect(messageService.totalUnreadMessages).toBe(expectedUnreadCount);
    });

    it('should call persistencyService.updateInbox after the inbox response is returned', () => {
      spyOn(persistencyService, 'updateInbox');

      service.init();

      expect(persistencyService.updateInbox).toHaveBeenCalledWith(parsedConversaitonsResponse);
    });

    it('should emit a EventService.INBOX_LOADED after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();

      service.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.INBOX_LOADED, parsedConversaitonsResponse);
    });

    it('should emit a EventService.CHAT_CAN_PROCESS_RT with TRUE after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();

      service.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    describe('when a NEW_MESSAGE event is emitted', () => {
      let conversation, currentLastMessage;
      beforeEach(() => {
        service.init();
        conversation = service.conversations[0];
        currentLastMessage = conversation.lastMessage;
      });

      it('should update the lastMessage and the modifiedDate wth the new message', () => {
        const newMessage = new Message('mockId', conversation.id, 'hola!', 'mockUserId', new Date());

        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].lastMessage).toEqual(newMessage);
        expect(service.conversations[0].modifiedDate).toEqual(newMessage.date);
      });

      it('should NOT update the lastMessage NOR the modifiedDate if the new message has the same ID as the current lastMessage', () => {
        console.log(conversation, currentLastMessage);
        const newMessage = new Message(currentLastMessage.id, conversation, 'hola!', 'mockUserId');
        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(conversation.lastMessage).toEqual(currentLastMessage);
        expect(conversation.modifiedDate).toEqual(currentLastMessage.date);
      });

      it('should increment the unread counters by one for each new message not fromSelf', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const count = 3;
        for (let i = 0; i < count; i++) {
          const msg = new Message('mockId' + i, conversation.id, 'hola!', 'mockUserId');
          msg.fromSelf = false;
          eventService.emit(EventService.NEW_MESSAGE, msg);
        }

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + count);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore + count);
      });

      it('should NOT increase the unread counts if the new message has the same ID as the current lastMessage', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const newMessage = new Message(currentLastMessage.id, conversation.id, 'hola!', 'mockUserId');
        newMessage.fromSelf = false;

        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });

      it('should only increase the unread counters for new messages NOT fromSelf and with unique IDs', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const newMessage = new Message('mockId', conversation.id, 'hola!', 'mockUserId');
        newMessage.fromSelf = false;

        eventService.emit(EventService.NEW_MESSAGE, newMessage);
        eventService.emit(EventService.NEW_MESSAGE, newMessage);
        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + 1);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore + 1);
  });

      it('should NOT increase conversation.unreadCount NOR messageService.totalUnreadMessages for new messages fromSelf', () => {
        const newMessage = new Message('mockId', conversation, 'hola!', 'mockUserId');
        newMessage.fromSelf = true;
        const unreadCounterBefore = service.conversations[0].unreadCounter;

        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });
    });
  });
});

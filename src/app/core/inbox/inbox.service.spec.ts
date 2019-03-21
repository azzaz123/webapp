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
import { InboxMessage, messageStatus } from '../../chat/chat-with-inbox/message/inbox-message';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { INBOX_ITEM_STATUSES, InboxItemPlaceholder } from '../../chat/chat-with-inbox/inbox/inbox-item';
import { UserService } from '../user/user.service';
import { MockedUserService } from '../../../tests/user.fixtures.spec';
import { InboxUserPlaceholder } from '../../chat/chat-with-inbox/inbox/inbox-user';

let service: InboxService;
let http: HttpService;
let persistencyService: PersistencyService;
let messageService: MessageService;
let featureflagService: FeatureflagService;
let eventService: EventService;
let userService: UserService;
let selfId: string;

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
        { provide: UserService, useClass: MockedUserService },
        { provide: FeatureflagService, useValue: {
            getFlag() {
              return Observable.of(false);
            }
          }
        }
      ]
    });
    service = TestBed.get(InboxService);
    http = TestBed.get(HttpService);
    persistencyService = TestBed.get(PersistencyService);
    messageService = TestBed.get(MessageService);
    featureflagService = TestBed.get(FeatureflagService);
    eventService = TestBed.get(EventService);
    userService = TestBed.get(UserService);
    selfId = userService.user.id;
  });

  describe('getInboxFeatureFlag', () => {
    it('should call featureflagService.getFlag when called', () => {
      spyOn(featureflagService, 'getFlag');

      service.getInboxFeatureFlag();

      expect(featureflagService.getFlag).toHaveBeenCalledWith('web_inbox_projections');
    });
  });

  describe('init', () => {
    const res: Response = new Response(new ResponseOptions({ body: MOCK_INBOX_API_RESPONSE }));
    let parsedConversaitonsResponse;
    beforeEach(() => {
      spyOn(http, 'get').and.returnValue(Observable.of(res));
      parsedConversaitonsResponse = service['buildConversations'](JSON.parse(MOCK_INBOX_API_RESPONSE).conversations);
    });

    it('should set selfId as the of the logged in used', () => {
      spyOn(eventService, 'subscribe');

      service.init();

      expect(service['selfId']).toBe(userService.user.id);
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

    it('should return an array of InboxConversation`s with the correct lastMesage for each', () => {
      const apiResponse = res.json().conversations;

      service.init();

      service.conversations.map((conv, index) => {
        expect(conv instanceof InboxConversation).toBe(true);
        expect(conv.lastMessage.id).toEqual(apiResponse[index].messages[0].id);
      });
    });

    it('should set the number of unreadMessages in messageService', () => {
      let expectedUnreadCount = 0;
      res.json().conversations.filter(c => c.unread_messages).map(c => expectedUnreadCount += + c.unread_messages);

      service.init();

      expect(messageService.totalUnreadMessages).toBe(expectedUnreadCount);
    });

    it('should save the messages from each conversation via persistencyService', () => {
      spyOn(persistencyService, 'saveInboxMessages');

      service.init();

      res.json().conversations.map(conv => {
        const messages = [];
        conv.messages.map(msg => messages.push(new InboxMessage(msg.id, conv.hash, msg.text, msg.from_user_hash,
          msg.from_user_hash === selfId, new Date(msg.timestamp), msg.status, msg.payload)));
        expect(persistencyService.saveInboxMessages).toHaveBeenCalledWith(messages);
      });
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
        const newMessage = new InboxMessage('mockId', conversation.id, 'hola!', 'mockUserId', true,
          new Date(), messageStatus.SENT);

        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].lastMessage).toEqual(newMessage);
        expect(service.conversations[0].modifiedDate).toEqual(newMessage.date);
      });

      it('should NOT update the lastMessage NOR the modifiedDate if the new message has the same ID as the current lastMessage', () => {
        const newMessage = new InboxMessage(currentLastMessage.id, conversation.id, 'hola!', 'mockUserId', true,
          new Date(), messageStatus.RECEIVED);
        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(conversation.lastMessage).toEqual(currentLastMessage);
        expect(conversation.modifiedDate).toEqual(currentLastMessage.date);
      });

      it('should increment the unread counters by one for each new message not fromSelf', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const count = 3;
        for (let i = 0; i < count; i++) {
          const msg = new InboxMessage('mockId' + i, conversation.id, 'hola!', 'mockUserId', false, new Date(),
            messageStatus.SENT);
          eventService.emit(EventService.NEW_MESSAGE, msg);
        }

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + count);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore + count);
      });

      it('should NOT increase the unread counts if the new message has the same ID as the current lastMessage', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const newMessage = new InboxMessage(currentLastMessage.id, conversation.id, 'hola!', 'mockUserId', false, new Date(),
          messageStatus.READ);

        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });

      it('should only increase the unread counters for new messages NOT fromSelf and with unique IDs', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const newMessage = new InboxMessage('mockId', conversation.id, 'hola!', 'mockUserId', false, new Date(), messageStatus.SENT);

        eventService.emit(EventService.NEW_MESSAGE, newMessage);
        eventService.emit(EventService.NEW_MESSAGE, newMessage);
        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + 1);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore + 1);
      });

      it('should NOT increase conversation.unreadCount NOR messageService.totalUnreadMessages for new messages fromSelf', () => {
        const newMessage = new InboxMessage('mockId', conversation, 'hola!', 'mockUserId', true, new Date(), messageStatus.SENT);
        const unreadCounterBefore = service.conversations[0].unreadCounter;

        eventService.emit(EventService.NEW_MESSAGE, newMessage);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });
    });

    describe('when a CHAT_SIGNAL event is emitted', () => {
      let conversation, lastMessage, dateAfter, dateBefore;
      beforeEach(() => {
        service.init();
        conversation = service.conversations[0];
        lastMessage = conversation.lastMessage;
        lastMessage.status = null;
        lastMessage.fromSelf = false;
        dateBefore = lastMessage.date.getTime() - 2000;
        dateAfter = lastMessage.date.getTime() + 2000;
      });

      it('should update the status of the lastMessage to SENT when a CHAT_SIGNAL event is emitted with a sentSignal', () => {
        const sentSingal = new ChatSignal(chatSignalType.SENT, conversation.id, null, lastMessage.id);

        eventService.emit(EventService.CHAT_SIGNAL, sentSingal);

        expect(conversation.lastMessage.status).toBe(messageStatus.SENT);
      });

      it('should update the status of the lastMessage to RECEIVED when a CHAT_SIGNAL event is emitted with a receivedSignal', () => {
        const receivedSingal = new ChatSignal(chatSignalType.RECEIVED, conversation.id, null, lastMessage.id);

        eventService.emit(EventService.CHAT_SIGNAL, receivedSingal);

        expect(conversation.lastMessage.status).toBe(messageStatus.RECEIVED);
      });

      it(`should update the status of the lastMessage to READ when a CHAT_SIGNAL event is emitted with a readSignal that meets the
        conditions: signal timestamp is after lastMessage timestamp AND signal fromSelf is the reverse of lastMessage fromSelf
        (because a READ signal fromSelf is meant to mark as read messages from the other user (!fromSelf))`, () => {
          const readSingalfromSelf = new ChatSignal(chatSignalType.READ, conversation.id, dateAfter, null, true);
          lastMessage.fromSelf = false;

          eventService.emit(EventService.CHAT_SIGNAL, readSingalfromSelf);

          expect(conversation.lastMessage.status).toBe(messageStatus.READ);

          const readSingalfromOther = new ChatSignal(chatSignalType.READ, conversation.id, dateAfter, null, false);
          lastMessage.status = messageStatus.RECEIVED;
          lastMessage.fromSelf = true;

          eventService.emit(EventService.CHAT_SIGNAL, readSingalfromOther);

          expect(conversation.lastMessage.status).toBe(messageStatus.READ);
        });

      it(`should NOT update the status of the lastMessage to READ when a CHAT_SIGNAL event is emitted with a readSignal that does not
        meet the conditions: signal timestamp is after lastMessage timestamp AND signal fromSelf is the reverse of lastMessage fromSelf
        (because a READ signal fromSelf is meant to mark as read messages from the other user (!fromSelf))`, () => {
          const readSingalfromSelf = new ChatSignal(chatSignalType.READ, conversation.id, dateAfter, null, false);
          lastMessage.fromSelf = false;

          eventService.emit(EventService.CHAT_SIGNAL, readSingalfromSelf);

          expect(conversation.lastMessage.status).not.toBe(messageStatus.READ);

          const readSingalfromOther = new ChatSignal(chatSignalType.READ, conversation.id, dateAfter, null, true);
          lastMessage.status = messageStatus.RECEIVED;
          lastMessage.fromSelf = true;

          eventService.emit(EventService.CHAT_SIGNAL, readSingalfromOther);

          expect(conversation.lastMessage.status).not.toBe(messageStatus.READ);
        });

      it(`should NOT update the status of the lastMessage to READ when a CHAT_SIGNAL event is emitted with a readSignal with
        timestamp before the lastMessage timestamp`, () => {
          const readSingal = new ChatSignal(chatSignalType.READ, conversation.id, dateBefore);

          eventService.emit(EventService.CHAT_SIGNAL, readSingal);

          expect(conversation.lastMessage.status).not.toBe(messageStatus.READ);
        });

      it(`should set the unread counters to 0 when a CHAT_SIGNAL event is emitted with a readSignal that is fromSelf AND with
        timestamp after the lastMessage timestamp`, () => {
          const readSingal = new ChatSignal(chatSignalType.READ, conversation.id, dateAfter, null, true);
          messageService.totalUnreadMessages = 12;
          conversation.unreadCounter = 7;

          eventService.emit(EventService.CHAT_SIGNAL, readSingal);

          expect(conversation.unreadCounter).toBe(0);
          expect(messageService.totalUnreadMessages).toBe(12 - 7);
        });

      it(`should NOT update the unread counters when a CHAT_SIGNAL event is emitted with a readSignal that is fromSelf and with a timestamp
        before the lastMessage timestamp`, () => {
          const readSingal = new ChatSignal(chatSignalType.READ, conversation.id, dateBefore, null, true);
          messageService.totalUnreadMessages = 12;
          conversation.unreadCounter = 7;

          eventService.emit(EventService.CHAT_SIGNAL, readSingal);

          expect(conversation.unreadCounter).toBe(7);
          expect(messageService.totalUnreadMessages).toBe(12);
        });

      it('should NOT update the unread counters when a CHAT_SIGNAL event is emitted with a readSignal that is NOT fromSelf', () => {
        const readSingal = new ChatSignal(chatSignalType.READ, conversation.id, dateAfter, null, false);
        messageService.totalUnreadMessages = 12;
        conversation.unreadCounter = 7;

        eventService.emit(EventService.CHAT_SIGNAL, readSingal);

        expect(conversation.unreadCounter).toBe(7);
        expect(messageService.totalUnreadMessages).toBe(12);
      });
    });
  });

  describe('process API item status as item flags', () => {
    let modifiedResponse;
    beforeEach(() => {
      modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE);
    });
    it('should set item.reserved TRUE when the API response returns an item with status reserved', () => {
      modifiedResponse.conversations[0].item.status = INBOX_ITEM_STATUSES.reserved;
      const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
      spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

      service.init();

      expect(service.conversations[0].item.reserved).toBe(true);
    });

    it('should set item.sold TRUE when the API response returns an item with status sold', () => {
      modifiedResponse.conversations[0].item.status = INBOX_ITEM_STATUSES.sold;
      const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
      spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

      service.init();

      expect(service.conversations[0].item.sold).toBe(true);
    });

    it('should set item.notAvailable TRUE when the API response returns an item with status not_available', () => {
      modifiedResponse.conversations[0].item.status = INBOX_ITEM_STATUSES.notAvailable;
      const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
      spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

      service.init();

      expect(service.conversations[0].item.notAvailable).toBe(true);
    });
  });

  describe('process API user status', () => {
    let modifiedResponse;
    beforeEach(() => {
      modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE);
    });

    describe('user blocked', () => {
      it('should set user.blocked FALSE when the API response returns blocked FALSE', () => {
        modifiedResponse.conversations[0].with_user.blocked = false;
        const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
        spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

        service.init();

        expect(service.conversations[0].user.blocked).toBe(false);
      });

      it('should set user.blocked TRUE when the API response returns blocked TRUE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = true;
        const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
        spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

        service.init();

        expect(service.conversations[0].user.blocked).toBe(true);
      });

      it('should set user.blocked FALSE when the API response returns blocked TRUE AND available FALSE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = false;
        const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
        spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

        service.init();

        expect(service.conversations[0].user.blocked).toBe(false);
      });
    });

    describe('user available', () => {
      it('should set user.available FALSE when the API response returns available FALSE', () => {
        modifiedResponse.conversations[0].with_user.available = false;
        const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
        spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

        service.init();

        expect(service.conversations[0].user.available).toBe(false);
      });

      it('should set user.available TRUE when the API response returns blocked TRUE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = true;
        const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
        spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

        service.init();

        expect(service.conversations[0].user.available).toBe(true);
      });

      it('should set user.available TRUE when the API response returns blocked FALSE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = false;
        modifiedResponse.conversations[0].with_user.available = true;
        const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
        spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

        service.init();

        expect(service.conversations[0].user.available).toBe(true);
      });
    });
  });

  describe('process API response with missing user OR item', () => {
    let modifiedResponse;
    beforeEach(() => {
      modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE);
    });

    it('should set InboxItemPlaceholder as the item of a InboxConversation, when the API response does not return an item object', () => {
      delete modifiedResponse.conversations[0].item;
      const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
      spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

      service.init();

      expect(service.conversations[0].item).toEqual(InboxItemPlaceholder);
    });

    it('should set InboxUserPlaceholder as the user of a InboxConversation, when the API response does not return a user object', () => {
      delete modifiedResponse.conversations[0].with_user;
      const mockedRes: Response = new Response(new ResponseOptions({ body: JSON.stringify(modifiedResponse) }));
      spyOn(http, 'get').and.returnValue(Observable.of(mockedRes));

      service.init();

      expect(service.conversations[0].user).toEqual(InboxUserPlaceholder);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InboxConversationService } from './inbox-conversation.service';
import { MessageService } from '../message/message.service';
import { RealTimeService } from '../message/real-time.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { EventService } from '../event/event.service';
import { CREATE_MOCK_INBOX_CONVERSATION, createInboxConversationsArray } from '../../../tests/inbox.fixtures.spec';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { chatSignalType, ChatSignal } from '../message/chat-signal.interface';
import { Message } from '../message/message';
import { messageStatus, InboxMessage, MessageType } from '../../chat/chat-with-inbox/message/inbox-message';
import { createInboxMessagesArray } from '../../../tests/message.fixtures.spec';
import { UserService } from '../user/user.service';
import { MockedUserService, MOCK_USER } from '../../../tests/user.fixtures.spec';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { ResponseOptions, Response } from '@angular/http';
import { MOCK_API_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { Observable } from 'rxjs';
import { ItemService } from '../item/item.service';
import { MockedItemService } from '../../../tests/item.fixtures.spec';
import { HttpModuleNew } from '../http/http.module.new';
import { environment } from '../../../environments/environment';

let service: InboxConversationService;
let http: HttpService;
let eventService: EventService;
let realTime: RealTimeService;
let persistencyService: PersistencyService;
let messageService: MessageService;
let userService: UserService;
let itemService: ItemService;
let httpTestingController: HttpTestingController;

describe('InboxConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpModuleNew
      ],
      providers: [
        InboxConversationService,
        ...TEST_HTTP_PROVIDERS,
        EventService,
        {
          provide: RealTimeService, useValue: {
            sendRead() {
            }
          }
        },
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: MessageService, useValue: { totalUnreadMessages: 0 } },
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService }
      ]
    });
    service = TestBed.get(InboxConversationService);
    http = TestBed.get(HttpService);
    eventService = TestBed.get(EventService);
    realTime = TestBed.get(RealTimeService);
    persistencyService = TestBed.get(PersistencyService);
    messageService = TestBed.get(MessageService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    httpTestingController = TestBed.get(HttpTestingController);
    spyOnProperty(userService, 'user').and.returnValue(MOCK_USER);
    service.subscribeChatEvents();
    service.archivedConversations = [];
  });

  describe('subscribe chat events', () => {
    it('should parse a Message to InboxMessage and call processNewMessages when a NEW_MESSAGE event is emitted', () => {
      spyOn(service, 'processNewMessage');
      const message = new Message('mockId', 'thread-id', 'hola!', 'mockUserId', new Date(), messageStatus.SENT);
      const inboxMessage = new InboxMessage(message.id, message.thread, message.message, message.from, message.fromSelf,
        message.date, message.status, MessageType.TEXT, message.payload, message.phoneRequest);

      eventService.emit(EventService.NEW_MESSAGE, message);

      expect(service.processNewMessage).toHaveBeenCalledWith(inboxMessage);
    });

    it('should set conversations when a INBOX_LOADED event is emitted', () => {
      const conversations = createInboxConversationsArray(6);

      eventService.emit(EventService.INBOX_LOADED, conversations);

      expect(service.conversations).toBe(conversations);
    });

    it('should call procesNewChatSignal when a CHAT_SIGNAL event is emitted', () => {
      spyOn(service, 'processNewChatSignal');
      const signal = new ChatSignal(chatSignalType.SENT, 'thread id', null, 'message-id');

      eventService.emit(EventService.CHAT_SIGNAL, signal);

      expect(service.processNewChatSignal).toHaveBeenCalledWith(signal);
    });
  });

  describe('openConversation', () => {
    let conversation: InboxConversation;
    beforeEach(() => {
      spyOn(eventService, 'emit').and.callThrough();
      spyOn(realTime, 'sendRead');
      conversation = CREATE_MOCK_INBOX_CONVERSATION('my-id');
    });

    it('should emit a CURRENT_CONVERSATION_SET event when called', () => {
      service.openConversation(conversation);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CURRENT_CONVERSATION_SET, conversation);
    });

    it('should call realTime.sendRead if the conversation has unread messages', () => {
      conversation.unreadCounter = 5;

      service.openConversation(conversation);

      expect(realTime.sendRead).toHaveBeenCalledWith(conversation.user.id, conversation.id);
    });

    it('should NOT call realTime.sendRead if the conversation does NOT have unread messages', () => {
      conversation.unreadCounter = 0;

      service.openConversation(conversation);

      expect(realTime.sendRead).not.toHaveBeenCalled();
    });
  });

  describe('processNewMessage', () => {
    let conversations, currentLastMessage, newInboxMessage;
    beforeEach(() => {
      conversations = createInboxConversationsArray(4);
      eventService.emit(EventService.INBOX_LOADED, conversations);
    });

    describe('when called with a message that does not already exist', () => {
      beforeEach(() => {
        newInboxMessage = new InboxMessage('newMessageId', conversations[0].id, 'hole', 'mockUserId', true, new Date(), messageStatus.SENT, MessageType.TEXT);
      });

      it('should prepend the new message to the conversation messages array', () => {
        service.processNewMessage(newInboxMessage);

        expect(service.conversations[0].messages[0]).toEqual(newInboxMessage);
      });

      it('should set conversation lastMessage to the new message', () => {
        service.processNewMessage(newInboxMessage);

        expect(service.conversations[0].lastMessage).toEqual(newInboxMessage);
      });

      it('should update the conversaiton modifiedDate with the new message date', () => {
        service.processNewMessage(newInboxMessage);

        expect(service.conversations[0].modifiedDate).toEqual(newInboxMessage.date);
      });

      it('should bump the conversation to 1st position', () => {
        const conversationToBump = service.conversations[1];
        const message = new InboxMessage('mockId', conversationToBump.id, 'hola!', 'mockUserId', true,
          new Date(), messageStatus.SENT, MessageType.TEXT);

        service.processNewMessage(message);

        expect(service.conversations.indexOf(conversationToBump)).toBe(0);
      });

      it('should call persistencyService.saveInboxMessages with the new message', () => {
        spyOn(persistencyService, 'saveInboxMessages');

        service.processNewMessage(newInboxMessage);

        expect(persistencyService.saveInboxMessages).toHaveBeenCalledWith(newInboxMessage);
      });

      it('should emit a MESSAGE_ADDED event, passing the new InboxMessage', () => {
        spyOn(eventService, 'emit').and.callThrough();

        service.processNewMessage(newInboxMessage);

        expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_ADDED, newInboxMessage);
      });

      it('should increment the unread counters by one for each new message not fromSelf', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const count = 3;
        for (let i = 0; i < count; i++) {
          const msg = new InboxMessage('mockId' + i, conversations[0].id, 'hola!', 'mockUserId', false, new Date(),
            messageStatus.SENT, MessageType.TEXT);
          service.processNewMessage(msg);
        }

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + count);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore + count);
      });

      it('should only increment the unread counters for new messages NOT fromSelf AND with unique IDs', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const message = new InboxMessage('mockId', conversations[0].id, 'hola!', 'mockUserId', false, new Date(), messageStatus.SENT, MessageType.TEXT);

        service.processNewMessage(message);
        service.processNewMessage(message);
        service.processNewMessage(message);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + 1);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore + 1);
      });

      it('should not increment the conversation.unreadCount nor the messageService.totalUnreadMessages for new messages fromSelf', () => {
        const message = new InboxMessage('mockId', conversations[0].id, 'hola!', 'mockUserId', true, new Date(), messageStatus.SENT, MessageType.TEXT);
        const unreadCounterBefore = service.conversations[0].unreadCounter;

        service.processNewMessage(message);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });
    });

    describe('when called with a message that already exists', () => {
      beforeEach(() => {
        currentLastMessage = conversations[0].lastMessage;
        newInboxMessage = new InboxMessage(conversations[0].messages[0].id, conversations[0].id, 'hola!', 'mockUserId', true,
          new Date(), messageStatus.RECEIVED, MessageType.TEXT);
        service.processNewMessage(newInboxMessage);
      });

      it('should not add the duplicated message to the conversation', () => {
        const messagesFound = conversations[0].messages.filter(m => m.id === newInboxMessage.id);

        expect(messagesFound.length).toBe(1);
      });

      it('should not update the lastMessage of the conversation', () => {
        expect(conversations[0].lastMessage).toEqual(currentLastMessage);
      });

      it('should not update the modifiedDate of the conversation', () => {
        expect(conversations[0].modifiedDate).toEqual(currentLastMessage.date);
      });

      it('should not bump the conversation to 1st position', () => {
        const conversationToBump = service.conversations[1];
        const message = new InboxMessage(conversationToBump.lastMessage.id, conversationToBump.id, 'hola!', 'mockUserId', true,
          new Date(), messageStatus.SENT, MessageType.TEXT);

        service.processNewMessage(message);

        expect(service.conversations.indexOf(conversationToBump)).not.toBe(0);
      });

      it('should NOT increase the unread counts if the new message has the same ID as the current lastMessage', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const message = new InboxMessage(currentLastMessage.id, conversations[0].id, 'hola!', 'mockUserId', false, new Date(),
          messageStatus.READ, MessageType.TEXT);

        service.processNewMessage(message);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(messageService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });
    });

    describe('when called with a conversation that not exists', () => {
      beforeEach(() => {
        currentLastMessage = conversations[0].lastMessage;
        newInboxMessage = new InboxMessage('newMessageId', 'newConversationId', 'hola!', 'mockUserId', true,
          new Date(), messageStatus.RECEIVED, MessageType.TEXT);
      });

      it('should call fetch new conversation', () => {
        spyOn(http, 'get').and.callThrough();

        service.processNewMessage(newInboxMessage);

        expect(http.get).toHaveBeenCalledWith(service['API_URL'] + newInboxMessage.thread);
      });

      it('should add new conversation to the top of the list if fetch succeed', () => {
        const apiResponse: Response = new Response(new ResponseOptions({ body: JSON.stringify(MOCK_API_CONVERSATION) }));
        spyOn(http, 'get').and.returnValue(Observable.of(apiResponse));

        service.processNewMessage(newInboxMessage);

        expect(service.conversations[0].id).toEqual(MOCK_API_CONVERSATION.hash);
      });

      it('should add new conversation with received message to the top of the list if fetch failed', () => {
        const apiResponse: Response = new Response(new ResponseOptions({ body: JSON.stringify(MOCK_API_CONVERSATION) }));
        spyOn(http, 'get').and.returnValue(Observable.throw(new Error('Test error')));

        service.processNewMessage(newInboxMessage);

        expect(service.conversations[0].id).toEqual(newInboxMessage.thread);
        expect(service.conversations[0].lastMessage.id).toEqual(newInboxMessage.id);
      });
    });
  });

  describe('processNewChatSignal', () => {
    let mockedConversation: InboxConversation;
    const timestamp = new Date(CREATE_MOCK_INBOX_CONVERSATION().messages[0].date).getTime();
    beforeEach(() => {
      eventService.emit(EventService.INBOX_LOADED, createInboxConversationsArray(12));
    });

    describe('when processing read signals', () => {
      let expectedMarkedAsRead, expectedNotMarkedAsRead;
      const unreadCount = 5;
      beforeEach(() => {
        spyOn(persistencyService, 'updateInboxMessageStatus');
        mockedConversation = service.conversations[0];
        mockedConversation.messages = createInboxMessagesArray(10);
        messageService.totalUnreadMessages = unreadCount;
        mockedConversation.unreadCounter = unreadCount;
      });

      it(`should NOT call persistencyService.updateInboxMessageStatus when the signal ID does not match
        any message ID in the conversation`, () => {
        const signal = new ChatSignal(chatSignalType.READ, 'non-existant-conv-id', timestamp);

        service.processNewChatSignal(signal);

        expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalled();
      });

      describe('when processing a READ chat signal NOT fromSelf', () => {
        it(`should update status to READ for messages fromSelf and status RECEIVED`, () => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? true : false;
            m.status = messageStatus.RECEIVED;
          });
          expectedMarkedAsRead = mockedConversation.messages.filter(m => m.fromSelf && (m.status === messageStatus.SENT ||
            m.status === messageStatus.RECEIVED));
          expectedNotMarkedAsRead = mockedConversation.messages.filter(m => !m.fromSelf);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processNewChatSignal(signal);

          expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledTimes(unreadCount);
          expectedMarkedAsRead.forEach(m => {
            expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledWith(m, messageStatus.READ);
          });

          expectedNotMarkedAsRead.forEach(m => {
            expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.READ);
          });
        });

        it(`should update status to READ for messages fromSelf and status SENT`, () => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? true : false;
            m.status = messageStatus.SENT;
          });
          expectedMarkedAsRead = mockedConversation.messages.filter(m => m.fromSelf && (m.status === messageStatus.SENT ||
            m.status === messageStatus.RECEIVED));
          expectedNotMarkedAsRead = mockedConversation.messages.filter(m => !m.fromSelf);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processNewChatSignal(signal);

          expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledTimes(unreadCount);
          expectedMarkedAsRead.forEach(m => {
            expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledWith(m, messageStatus.READ);
          });

          expectedNotMarkedAsRead.forEach(m => {
            expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.READ);
          });
        });

        it(`should NOT update status to READ for messages fromSelf and status PENDING`, () => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? true : false;
            m.status = messageStatus.PENDING;
          });

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processNewChatSignal(signal);

          expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalled();
        });

        it('should NOT decrase the unreadMessages counter of the conversation', () => {
          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processNewChatSignal(signal);

          expect(mockedConversation.unreadCounter).toBe(unreadCount);
        });

        it('should NOT decrease messageService.totalUnreadMessages counter', () => {
          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processNewChatSignal(signal);

          expect(messageService.totalUnreadMessages).toBe(unreadCount);
        });
      });

      describe('when processing a READ chat signal fromSelf', () => {
        beforeEach(() => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? false : true;
            m.status = messageStatus.RECEIVED;
          });
          expectedMarkedAsRead = mockedConversation.messages.filter(m => !m.fromSelf);
          expectedNotMarkedAsRead = mockedConversation.messages.filter(m => m.fromSelf);
        });

        it(`should update status to READ for messages NOT fromSelf`, () => {
          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);

          service.processNewChatSignal(signal);

          expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledTimes(unreadCount);
          expectedMarkedAsRead.forEach(m => {
            expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledWith(m, messageStatus.READ);
          });

          expectedNotMarkedAsRead.forEach(m => {
            expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.READ);
          });
        });

        it('should decrase the unreadMessages counter of the conversation by the number of messages that are being marked as READ', () => {
          expect(mockedConversation.unreadCounter).toBe(unreadCount);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(mockedConversation.unreadCounter).toBe(0);
        });

        it(`should set unreadMessages counter of the conversation to 0 if the number of messages that are being marked as READ is greater
        than the existing counter (disallow negative values in counter)`, () => {
          mockedConversation.unreadCounter = 1;

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(mockedConversation.unreadCounter).toBe(0);
        });

        it('should decrase messageService.totalUnreadMessages counter by the number of messages that are being marked as READ', () => {
          expect(mockedConversation.unreadCounter).toBe(unreadCount);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(messageService.totalUnreadMessages).toBe(0);
        });

        it(`should set messageService.totalUnreadMessages counter to 0 if the number of messages that are being marked as READ is greater
        than the existing counter (disallow negative values in counter)`, () => {
          mockedConversation.unreadCounter = 5;

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(messageService.totalUnreadMessages).toBe(0);
        });
      });
    });

    describe('when processing sent and received signals', () => {
      beforeEach(() => {
        spyOn(persistencyService, 'updateInboxMessageStatus');
        mockedConversation = service.conversations[0];
        mockedConversation.messages = createInboxMessagesArray(8);
      });

      it(`should NOT call persistencyService.updateInboxMessageStatus when called with a thread that does not match
      any conversation ID`, () => {
        const sentSignal = new ChatSignal(chatSignalType.SENT, 'non-existant-thread', timestamp, mockedConversation.messages[0].id);

        service.processNewChatSignal(sentSignal);

        expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalled();
      });

      it(`should NOT call persistencyService.updateInboxMessageStatus when called with a messageId does not match any message ID
      in the conversation`, () => {
        const sentSignal = new ChatSignal(chatSignalType.SENT, mockedConversation.id, timestamp, 'non-existant-id');

        service.processNewChatSignal(sentSignal);

        expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalled();
      });

      it(`should update message status ONLY for messages that meet the criteria:
        message status is missing OR message status is NULL OR the new status order is greater than the current status order`, () => {
        mockedConversation.messages[0].status = messageStatus.SENT;
        mockedConversation.messages[1].status = null;
        mockedConversation.messages[2].status = messageStatus.RECEIVED;

        const signal1 = new ChatSignal(chatSignalType.RECEIVED, mockedConversation.id, timestamp, mockedConversation.messages[0].id);
        const signal2 = new ChatSignal(chatSignalType.RECEIVED, mockedConversation.id, timestamp, mockedConversation.messages[1].id);
        const signal3 = new ChatSignal(chatSignalType.SENT, mockedConversation.id, timestamp, mockedConversation.messages[2].id);

        service.processNewChatSignal(signal1);
        service.processNewChatSignal(signal2);
        service.processNewChatSignal(signal3);

        const expectedChangedMessages = mockedConversation.messages.slice(0, 2);
        const expectedNotChangedMessages = mockedConversation.messages.slice(-1);

        expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledTimes(2);
        expectedChangedMessages.forEach(m => {
          expect(persistencyService.updateInboxMessageStatus).toHaveBeenCalledWith(m, messageStatus.RECEIVED);
        });

        expectedNotChangedMessages.forEach(m => {
          expect(persistencyService.updateInboxMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.SENT);
        });
      });
    });
  });

  describe('archive conversation', () => {
    beforeEach(() => {
      spyOn(eventService, 'emit').and.callThrough();
      service.conversations = createInboxConversationsArray(1);
    });

    it('with success should emit CONVERSATION_ARCHIVED event', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));

      service.archive(service.conversations[0]).subscribe().unsubscribe();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_ARCHIVED, service.conversations[0]);
    });

    it('with 409 error should emit CONVERSATION_ARCHIVED event', () => {
      spyOn(http, 'put').and.returnValue(Observable.throwError({ status: 409 }));

      service.archive(service.conversations[0]).subscribe().unsubscribe();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_ARCHIVED, service.conversations[0]);
    });
  });

  describe('unarchive conversation', () => {
    beforeEach(() => {
      spyOn(eventService, 'emit').and.callThrough();
      service.archivedConversations = createInboxConversationsArray(1);
    });

    it('with success should emit CONVERSATION_UNARCHIVED event', () => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));

      service.unarchive(service.archivedConversations[0]).subscribe().unsubscribe();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_UNARCHIVED, service.archivedConversations[0]);
    });

    it('with 409 error should emit CONVERSATION_UNARCHIVED event', () => {
      spyOn(http, 'put').and.returnValue(Observable.throwError({ status: 409 }));

      service.unarchive(service.archivedConversations[0]).subscribe().unsubscribe();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_UNARCHIVED, service.archivedConversations[0]);
    });
  });

  describe('isConversationArchived', () => {
    it('should check if conversation is archived', () => {
      const mockConversation = CREATE_MOCK_INBOX_CONVERSATION();

      service.archivedConversations = null;
      expect(service.isConversationArchived(null)).toBeFalsy();

      service.archivedConversations = [];
      expect(service.isConversationArchived(null)).toBeFalsy();

      service.archivedConversations = [mockConversation];
      expect(service.isConversationArchived(null)).toBeFalsy();

      service.archivedConversations = null;
      expect(service.isConversationArchived(mockConversation)).toBeFalsy();

      service.archivedConversations = [];
      expect(service.isConversationArchived(mockConversation)).toBeFalsy();

      service.archivedConversations = [mockConversation];
      expect(service.isConversationArchived(mockConversation)).toBeTruthy();
    });
  });

  describe('fetchConversation', () => {
    it('should fetch conversation if not exist locally', () => {
      const ITEM_ID = 'ITEM_ID';

      service.conversations = [];
      service.archivedConversations = [];

      service.openConversationByItemId$(ITEM_ID).subscribe();

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/conversations`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ item_id: ITEM_ID });
    });
  });
});

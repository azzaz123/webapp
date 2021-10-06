import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { ItemService } from '@core/item/item.service';
import { RealTimeService } from '@core/message/real-time.service';
import { RemoteConsoleService } from '@core/remote-console';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { MOCK_API_CONVERSATION } from '@fixtures/conversation.fixtures.spec';
import { createInboxConversationsArray, CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/inbox.fixtures.spec';
import { MockedItemService } from '@fixtures/item.fixtures.spec';
import { createInboxMessagesArray } from '@fixtures/message.fixtures.spec';
import { RealTimeServiceMock } from '@fixtures/real-time.fixtures.spec';
import { MockedUserService, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { DesktopNotificationsService } from 'app/core/desktop-notifications/desktop-notifications.service';
import { I18nService } from 'app/core/i18n/i18n.service';
import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { uniq } from 'lodash-es';
import * as moment from 'moment';
import { of } from 'rxjs';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { InboxMessage, MessageStatus, MessageType, InboxConversation } from '../model';
import { ChatSignal, ChatSignalType } from '../model/chat-signal';
import { ERROR_CODE_TOO_MANY_NEW_CONVERSATIONS, InboxConversationService } from './inbox-conversation.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('InboxConversationService', () => {
  let service: InboxConversationService;
  let eventService: EventService;
  let realTime: RealTimeService;
  let remoteConsoleService: RemoteConsoleService;
  let unreadChatMessagesService: UnreadChatMessagesService;
  let userService: UserService;
  let itemService: ItemService;
  let toastService: ToastService;
  let i18nService: I18nService;
  let desktopNotificationsService: DesktopNotificationsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InboxConversationService,
        EventService,
        { provide: RealTimeService, useClass: RealTimeServiceMock },
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'ACCESS_TOKEN',
          },
        },
        {
          provide: RemoteConsoleService,
          useValue: { sendPresentationMessageTimeout: () => {} },
        },
        {
          provide: UnreadChatMessagesService,
          useValue: { totalUnreadMessages: 0 },
        },
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService },
        ToastService,
        I18nService,
        DesktopNotificationsService,
      ],
    });
    service = TestBed.inject(InboxConversationService);
    eventService = TestBed.inject(EventService);
    realTime = TestBed.inject(RealTimeService);
    remoteConsoleService = TestBed.inject(RemoteConsoleService);
    unreadChatMessagesService = TestBed.inject(UnreadChatMessagesService);
    userService = TestBed.inject(UserService);
    itemService = TestBed.inject(ItemService);
    toastService = TestBed.inject(ToastService);
    i18nService = TestBed.inject(I18nService);
    desktopNotificationsService = TestBed.inject(DesktopNotificationsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_USER);
    service.subscribeChatEvents();
    service.conversations = [];
    service.archivedConversations = [];
  });

  describe('subscribe chat events', () => {
    it('should parse a Message to InboxMessage and call processNewMessages when a NEW_MESSAGE event is emitted', () => {
      spyOn(service, 'processNewMessage');
      const inboxMessage = new InboxMessage(
        'mockId',
        'thread-id',
        'hola!',
        'mockUserId',
        true,
        new Date(),
        MessageStatus.SENT,
        MessageType.TEXT
      );

      eventService.emit(EventService.NEW_MESSAGE, inboxMessage);

      expect(service.processNewMessage).toHaveBeenCalledWith(inboxMessage);
    });

    it('should call procesNewChatSignal when a CHAT_SIGNAL event is emitted', () => {
      spyOn(service, 'processNewChatSignal');
      const signal = new ChatSignal(ChatSignalType.SENT, 'thread id', null, 'message-id');

      eventService.emit(EventService.CHAT_SIGNAL, signal);

      expect(service.processNewChatSignal).toHaveBeenCalledWith(signal);
    });
  });

  describe('openConversation', () => {
    let conversation: InboxConversation;
    beforeEach(() => {
      spyOn(service, 'resendPendingMessages');
      spyOn(eventService, 'emit').and.callThrough();
      spyOn(realTime, 'sendRead');
      conversation = CREATE_MOCK_INBOX_CONVERSATION('my-id');
    });

    it('should emit a CURRENT_CONVERSATION_SET event when called', () => {
      service.openConversation(conversation);

      expect(service.resendPendingMessages).toHaveBeenCalled();
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CURRENT_CONVERSATION_SET, conversation);
    });

    it('should call realTime.sendRead if the conversation has unread messages', () => {
      conversation.unreadCounter = 5;

      service.openConversation(conversation);

      expect(service.resendPendingMessages).toHaveBeenCalled();
      expect(realTime.sendRead).toHaveBeenCalledWith(conversation.user.id, conversation.id);
    });

    it('should NOT call realTime.sendRead if the conversation does NOT have unread messages', () => {
      conversation.unreadCounter = 0;

      service.openConversation(conversation);

      expect(service.resendPendingMessages).toHaveBeenCalled();
      expect(realTime.sendRead).not.toHaveBeenCalled();
    });
  });

  describe('openConversationByConversationId$', () => {
    it('should return undefined if id is NULL', () => {
      service.conversations = null;
      service.openConversationByConversationId$(null).subscribe((conversation) => expect(conversation).toBeNull());
    });

    it('should return undefined if list of conversations is empty', () => {
      service.conversations = [];
      service.openConversationByConversationId$(null).subscribe((conversation) => expect(conversation).toBeUndefined());
    });

    it('should return undefined if conversations list does not contains conversation with id', () => {
      service.conversations = createInboxConversationsArray(1);
      service.openConversationByConversationId$('ID_DOES_NOT_EXIST').subscribe((conversation) => expect(conversation).toBeUndefined());
    });

    it('should return undefined if conversations list does not contains conversation with id', () => {
      service.conversations = createInboxConversationsArray(5);
      service.openConversationByConversationId$('4').subscribe((conversation) => expect(conversation.id).toEqual('4'));
    });
  });

  describe('processNewMessage', () => {
    let conversations, currentLastMessage, newInboxMessage;
    beforeEach(() => {
      conversations = createInboxConversationsArray(4);
      service.conversations = conversations;
    });

    describe('when called with a message that does not already exist', () => {
      beforeEach(() => {
        newInboxMessage = new InboxMessage(
          'newMessageId',
          conversations[0].id,
          'hole',
          'mockUserId',
          true,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );
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
        const message = new InboxMessage(
          'mockId',
          conversationToBump.id,
          'hola!',
          'mockUserId',
          true,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );

        service.processNewMessage(message);

        expect(service.conversations.indexOf(conversationToBump)).toBe(0);
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
          const msg = new InboxMessage(
            'mockId' + i,
            conversations[0].id,
            'hola!',
            'mockUserId',
            false,
            new Date(),
            MessageStatus.SENT,
            MessageType.TEXT
          );
          service.processNewMessage(msg);
        }

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + count);
        expect(unreadChatMessagesService.totalUnreadMessages).toEqual(unreadCounterBefore + count);
      });

      it('should only increment the unread counters for new messages NOT fromSelf AND with unique IDs', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const message = new InboxMessage(
          'mockId',
          conversations[0].id,
          'hola!',
          'mockUserId',
          false,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );

        service.processNewMessage(message);
        service.processNewMessage(message);
        service.processNewMessage(message);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore + 1);
        expect(unreadChatMessagesService.totalUnreadMessages).toEqual(unreadCounterBefore + 1);
      });

      it('should not increment the conversation.unreadCount nor the unreadChatMessagesService.totalUnreadMessages for new messages fromSelf', () => {
        const message = new InboxMessage(
          'mockId',
          conversations[0].id,
          'hola!',
          'mockUserId',
          true,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );
        const unreadCounterBefore = service.conversations[0].unreadCounter;

        service.processNewMessage(message);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(unreadChatMessagesService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });

      describe('and when the message is not from self', () => {
        let messageFromUser: InboxMessage;

        beforeEach(() => {
          messageFromUser = new InboxMessage(
            'mockId',
            conversations[0].id,
            'hola!',
            'mockUserId',
            false,
            new Date(),
            MessageStatus.SENT,
            MessageType.TEXT
          );
          spyOn(desktopNotificationsService, 'sendFromInboxMessage');
        });

        it('should delegate the desktop notification to be opened or not', () => {
          service.processNewMessage(messageFromUser);

          expect(desktopNotificationsService.sendFromInboxMessage).toHaveBeenCalledTimes(1);
          expect(desktopNotificationsService.sendFromInboxMessage).toHaveBeenCalledWith(messageFromUser, conversations[0]);
        });
      });
    });

    describe('when add conversation to set', () => {
      beforeEach(() => {
        service.conversations = createInboxConversationsArray(12);
      });

      it('should return true if conversation exist', () => {
        expect(service.containsConversation(service.conversations[1])).toEqual(true);
        expect(service.containsConversation({ id: '1' } as InboxConversation)).toEqual(true);
      });

      it('should return false if conversation exist', () => {
        expect(service.containsConversation(null)).toEqual(false);
        expect(service.containsConversation(undefined)).toEqual(false);
        expect(service.containsConversation({} as InboxConversation)).toEqual(false);
        expect(
          service.containsConversation({
            id: 'notExistedConversationID',
          } as InboxConversation)
        ).toEqual(false);
      });
    });

    describe('when add archived conversation to set', () => {
      beforeEach(() => {
        service.archivedConversations = createInboxConversationsArray(12);
      });

      it('should return true if conversation exist', () => {
        expect(service.containsArchivedConversation(service.conversations[1])).toEqual(true);
        expect(service.containsArchivedConversation({ id: '1' } as InboxConversation)).toEqual(true);
      });

      it('should return false if conversation exist', () => {
        expect(service.containsArchivedConversation(null)).toEqual(false);
        expect(service.containsArchivedConversation(undefined)).toEqual(false);
        expect(service.containsArchivedConversation({} as InboxConversation)).toEqual(false);
        expect(
          service.containsArchivedConversation({
            id: 'notExistedConversationID',
          } as InboxConversation)
        ).toEqual(false);
      });
    });

    describe('when called with a message that already exists', () => {
      beforeEach(() => {
        currentLastMessage = conversations[0].lastMessage;
        newInboxMessage = new InboxMessage(
          conversations[0].messages[0].id,
          conversations[0].id,
          'hola!',
          'mockUserId',
          true,
          new Date(),
          MessageStatus.RECEIVED,
          MessageType.TEXT
        );
        service.processNewMessage(newInboxMessage);
      });

      it('should not add the duplicated message to the conversation', () => {
        const messagesFound = conversations[0].messages.filter((m) => m.id === newInboxMessage.id);

        expect(messagesFound.length).toBe(1);
      });

      it('should prevent before push duplicate message', fakeAsync(() => {
        const message = new InboxMessage(
          '10',
          'thread_123456',
          'hola!',
          'mockUserId',
          false,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );
        spyOn(eventService, 'emit').and.callThrough();
        spyOn<any>(service, 'getConversation').and.returnValue(of(message));

        service.processNewMessage(message);
        service.processNewMessage(message);

        tick();

        expect(service.conversations).toEqual(uniq(service.conversations, 'id'));
      }));

      it('should not update the lastMessage of the conversation', () => {
        expect(conversations[0].lastMessage).toEqual(currentLastMessage);
      });

      it('should not update the modifiedDate of the conversation', () => {
        expect(conversations[0].modifiedDate).toEqual(currentLastMessage.date);
      });

      it('should not bump the conversation to 1st position', () => {
        const conversationToBump = service.conversations[1];
        const message = new InboxMessage(
          conversationToBump.lastMessage.id,
          conversationToBump.id,
          'hola!',
          'mockUserId',
          true,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );

        service.processNewMessage(message);

        expect(service.conversations.indexOf(conversationToBump)).not.toBe(0);
      });

      it('should NOT increase the unread counts if the new message has the same ID as the current lastMessage', () => {
        const unreadCounterBefore = service.conversations[0].unreadCounter;
        const message = new InboxMessage(
          currentLastMessage.id,
          conversations[0].id,
          'hola!',
          'mockUserId',
          false,
          new Date(),
          MessageStatus.READ,
          MessageType.TEXT
        );

        service.processNewMessage(message);

        expect(service.conversations[0].unreadCounter).toEqual(unreadCounterBefore);
        expect(unreadChatMessagesService.totalUnreadMessages).toEqual(unreadCounterBefore);
      });
    });

    describe('when called with a conversation that not exists', () => {
      beforeEach(() => {
        currentLastMessage = conversations[0].lastMessage;
        newInboxMessage = new InboxMessage(
          'newMessageId',
          'newConversationId',
          'hola!',
          'mockUserId',
          true,
          new Date(),
          MessageStatus.RECEIVED,
          MessageType.TEXT
        );
      });

      it('should call fetch new conversation', () => {
        service.processNewMessage(newInboxMessage);

        const req = httpTestingController.expectOne(`${environment.baseUrl}bff/messaging/conversation/${newInboxMessage.thread}`);
        expect(req.request.method).toEqual('GET');
      });

      it('should send RECEIVE signal for new  with message', () => {
        const NEW_INBOX_CONVERSATION_ID = 'new-conversation-id';
        const newConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION(NEW_INBOX_CONVERSATION_ID);
        const newMessage = new InboxMessage(
          'new-message-id',
          NEW_INBOX_CONVERSATION_ID,
          'hola!',
          'user-id',
          false,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );
        newConversation.messages = [newMessage];

        spyOn<any>(service, 'getConversation').and.returnValue(of(newConversation));
        spyOn(realTime, 'sendDeliveryReceipt').and.callThrough();

        service.processNewMessage(newMessage);

        expect(realTime.sendDeliveryReceipt).toHaveBeenCalledWith(newConversation.user.id, newMessage.id, NEW_INBOX_CONVERSATION_ID);
      });

      it('should add new conversation to the top of the list if fetch succeed', () => {
        service.processNewMessage(newInboxMessage);

        const req = httpTestingController.expectOne(`${environment.baseUrl}bff/messaging/conversation/${newInboxMessage.thread}`);
        req.flush(MOCK_API_CONVERSATION);

        expect(req.request.method).toEqual('GET');
        expect(service.conversations[0].id).toEqual(MOCK_API_CONVERSATION.hash);
      });

      it('should add new conversation with received message to the top of the list if fetch failed', () => {
        service.processNewMessage(newInboxMessage);

        const req = httpTestingController.expectOne(`${environment.baseUrl}bff/messaging/conversation/${newInboxMessage.thread}`);
        req.error(new ErrorEvent('connection failed'));

        expect(req.request.method).toEqual('GET');
        expect(service.conversations[0].id).toEqual(newInboxMessage.thread);
        expect(service.conversations[0].lastMessage.id).toEqual(newInboxMessage.id);
      });
    });
  });

  describe('processNewChatSignal', () => {
    let mockedConversation: InboxConversation;
    const timestamp = new Date(CREATE_MOCK_INBOX_CONVERSATION().messages[0].date).getTime();
    beforeEach(() => {
      service.conversations = createInboxConversationsArray(12);
    });

    describe('when processing read signals', () => {
      let expectedMarkedAsRead, expectedNotMarkedAsRead;
      const unreadCount = 5;
      beforeEach(() => {
        mockedConversation = service.conversations[0];
        mockedConversation.messages = createInboxMessagesArray(10);
        unreadChatMessagesService.totalUnreadMessages = unreadCount;
        mockedConversation.unreadCounter = unreadCount;
      });

      describe('when processing a READ chat signal NOT fromSelf', () => {
        it('should NOT decrase the unreadMessages counter of the conversation', () => {
          const signal = new ChatSignal(ChatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processNewChatSignal(signal);

          expect(mockedConversation.unreadCounter).toBe(unreadCount);
        });

        it('should NOT decrease unreadChatMessagesService.totalUnreadMessages counter', () => {
          const signal = new ChatSignal(ChatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processNewChatSignal(signal);

          expect(unreadChatMessagesService.totalUnreadMessages).toBe(unreadCount);
        });
      });

      describe('when processing a READ chat signal fromSelf', () => {
        beforeEach(() => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? false : true;
            m.status = MessageStatus.RECEIVED;
          });
          expectedMarkedAsRead = mockedConversation.messages.filter((m) => !m.fromSelf);
          expectedNotMarkedAsRead = mockedConversation.messages.filter((m) => m.fromSelf);
        });

        it('should decrase the unreadMessages counter of the conversation by the number of messages that are being marked as READ', () => {
          expect(mockedConversation.unreadCounter).toBe(unreadCount);

          const signal = new ChatSignal(ChatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(mockedConversation.unreadCounter).toBe(0);
        });

        it(`should set unreadMessages counter of the conversation to 0 if the number of messages that are being marked as READ is greater
        than the existing counter (disallow negative values in counter)`, () => {
          mockedConversation.unreadCounter = 1;

          const signal = new ChatSignal(ChatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(mockedConversation.unreadCounter).toBe(0);
        });

        it('should decrase unreadChatMessagesService.totalUnreadMessages counter by the number of messages that are being marked as READ', () => {
          expect(mockedConversation.unreadCounter).toBe(unreadCount);

          const signal = new ChatSignal(ChatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(unreadChatMessagesService.totalUnreadMessages).toBe(0);
        });

        it(`should set unreadChatMessagesService.totalUnreadMessages counter to 0 if the number of messages that are being marked as READ is greater
        than the existing counter (disallow negative values in counter)`, () => {
          mockedConversation.unreadCounter = 5;

          const signal = new ChatSignal(ChatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processNewChatSignal(signal);

          expect(unreadChatMessagesService.totalUnreadMessages).toBe(0);
        });
      });
    });

    describe('when processing sent and received signals', () => {
      beforeEach(() => {
        mockedConversation = service.conversations[0];
        mockedConversation.messages = createInboxMessagesArray(8);
      });
    });
  });

  describe('archive conversation', () => {
    beforeEach(() => {
      spyOn(eventService, 'emit').and.callThrough();
      service.conversations = createInboxConversationsArray(1);
    });

    it('with success should emit CONVERSATION_ARCHIVED event', () => {
      service
        .archive$(service.conversations[0])
        .subscribe((conversation: InboxConversation) =>
          expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_ARCHIVED, service.conversations[0])
        );

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/instant-messaging/conversations/archive`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual({
        conversation_ids: [service.conversations[0].id],
      });
    });

    it('with 409 error should emit CONVERSATION_ARCHIVED event', () => {
      service
        .archive$(service.conversations[0])
        .subscribe((conversation: InboxConversation) =>
          expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_ARCHIVED, service.conversations[0])
        );

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/instant-messaging/conversations/archive`);
      expect(req.request.method).toEqual('PUT');
      req.flush('conflict', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('unarchive conversation', () => {
    beforeEach(() => {
      spyOn(eventService, 'emit').and.callThrough();
      service.archivedConversations = createInboxConversationsArray(1);
    });

    it('with success should emit CONVERSATION_UNARCHIVED event', () => {
      service
        .unarchive(service.archivedConversations[0])
        .subscribe((conversation: InboxConversation) =>
          expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_UNARCHIVED, service.archivedConversations[0])
        );

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/instant-messaging/conversations/unarchive`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual({
        conversation_ids: [service.archivedConversations[0].id],
      });
    });

    it('with 409 error should emit CONVERSATION_UNARCHIVED event', () => {
      service
        .unarchive(service.archivedConversations[0])
        .subscribe((conversation: InboxConversation) =>
          expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_UNARCHIVED, service.archivedConversations[0])
        );

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/instant-messaging/conversations/unarchive`);
      expect(req.request.method).toEqual('PUT');
      req.flush('conflict', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('isConversationArchived', () => {
    it('should check if conversation is archived', () => {
      const mockConversation = CREATE_MOCK_INBOX_CONVERSATION();

      service.archivedConversations = null;
      expect(service.containsArchivedConversation(null)).toBeFalsy();

      service.archivedConversations = [];
      expect(service.containsArchivedConversation(null)).toBeFalsy();

      service.archivedConversations = [mockConversation];
      expect(service.containsArchivedConversation(null)).toBeFalsy();

      service.archivedConversations = null;
      expect(service.containsArchivedConversation(mockConversation)).toBeFalsy();

      service.archivedConversations = [];
      expect(service.containsArchivedConversation(mockConversation)).toBeFalsy();

      service.archivedConversations = [mockConversation];
      expect(service.containsArchivedConversation(mockConversation)).toBeTruthy();
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

    describe('and when user can not open new conversations', () => {
      it('should display toast with error', () => {
        spyOn(toastService, 'show');
        const expectedToast: Toast = {
          title: i18nService.translate(TRANSLATION_KEY.TOAST_ERROR_TITLE),
          text: i18nService.translate(TRANSLATION_KEY.CHAT_TOO_MANY_CONVERSATIONS),
          type: TOAST_TYPES.ERROR,
        };

        service.openConversationByItemId$('1337').subscribe();
        httpTestingController
          .expectOne(`${environment.baseUrl}api/v3/conversations`)
          .flush({ code: ERROR_CODE_TOO_MANY_NEW_CONVERSATIONS }, { status: 500, statusText: 'error' });

        expect(toastService.show).toHaveBeenCalledWith(expectedToast);
      });
    });
  });

  describe('resendPendingMessages', () => {
    it('should NOT sent SENT SIGNAL if pending message NOT exist', () => {
      const conversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      conversation.messages[conversation.messages.length - 1].status = MessageStatus.RECEIVED;
      spyOn(realTime, 'resendMessage');

      service.resendPendingMessages(conversation);

      expect(realTime.resendMessage).not.toHaveBeenCalled();
    });

    it('should sent SENT SIGNAL if has pending message', () => {
      const conversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      const lastMessageIndex = conversation.messages.length - 1;
      conversation.messages[lastMessageIndex].status = MessageStatus.PENDING;
      conversation.messages[lastMessageIndex].date = new Date();
      spyOn(realTime, 'resendMessage');

      service.resendPendingMessages(conversation);

      expect(realTime.resendMessage).toHaveBeenCalled();
    });

    it('should NOT sent SENT SIGNAL if has pending message and date is longer than 5 days', () => {
      const conversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      const lastMessageIndex = conversation.messages.length - 1;
      conversation.messages[lastMessageIndex].status = MessageStatus.PENDING;
      conversation.messages[lastMessageIndex].date = moment(conversation.messages[lastMessageIndex].date).subtract(6, 'days').toDate();
      spyOn(realTime, 'resendMessage');

      service.resendPendingMessages(conversation);

      expect(realTime.resendMessage).not.toHaveBeenCalled();
    });
  });

  describe('addPhoneNumberToConversation', () => {
    it('should PUT phone number in conversation', () => {
      const PHONE_NUMBER = '+34547896321';
      const conversation = CREATE_MOCK_INBOX_CONVERSATION();

      service.addPhoneNumberToConversation$(conversation, PHONE_NUMBER).subscribe();

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/conversations/${conversation.id}/buyer-phone-number`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual({ phone_number: PHONE_NUMBER });
    });
  });
});

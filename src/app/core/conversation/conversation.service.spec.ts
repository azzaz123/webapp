/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConversationService } from './conversation.service';
import { HttpService } from '../http/http.service';
import { Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Conversation } from './conversation';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { ItemService } from '../item/item.service';
import { Item } from '../item/item';
import { XmppService } from '../xmpp/xmpp.service';
import { MessageService } from '../message/message.service';
import { PersistencyService } from '../persistency/persistency.service';
import { messageStatus, phoneMethod } from '../message/message';
import { EventService } from '../event/event.service';
import { NotificationService } from '../notification/notification.service';
import { TrackingService } from '../tracking/tracking.service';
import { ConversationTotals } from './totals.interface';
import { Lead } from './lead';
import {
  CONVERSATION_DATE,
  CONVERSATION_ID,
  CONVERSATION_PHONE,
  CONVERSATIONS_DATA,
  createConversationsArray,
  MOCK_CONVERSATION,
  SECOND_MOCK_CONVERSATION
} from '../../../tests/conversation.fixtures.spec';
import { MOCK_USER, MockedUserService, USER_ID, USER_ITEM_DISTANCE } from '../../../tests/user.fixtures.spec';
import { ITEM_ID, MockedItemService } from '../../../tests/item.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { createMessagesArray, MOCK_MESSAGE, MOCK_MESSAGE_FROM_OTHER, MOCK_RANDOM_MESSAGE } from '../../../tests/message.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveService } from '../message/archive.service';
import { I18nService } from '../i18n/i18n.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPhoneComponent } from '../../chat/modals/send-phone/send-phone.component';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from './block-user';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';
import { RemoteConsoleService } from '../remote-console';
import { InboxConversationServiceMock, InboxServiceMock, MockRemoteConsoleService } from '../../../tests';
import { InboxService } from '../inbox/inbox.service';
import { InboxConversationService } from '../inbox/inbox-conversation.service';

let service: ConversationService;
let http: HttpService;
let userService: UserService;
let itemService: ItemService;
let messageService: MessageService;
let notificationService: NotificationService;
let remoteConsoleService: RemoteConsoleService;
let realTime: RealTimeService;
let persistencyService: PersistencyService;
let eventService: EventService;
let trackingService: TrackingService;
let connectionService: ConnectionService;
let inboxService: InboxService;
let inboxConversationService: InboxConversationService;
let modalService: NgbModal;
let archiveService: MsgArchiveService;
let i18n: I18nService;

const MOCKED_CONVERSATION_DATA: any = CONVERSATIONS_DATA[0];
const EMPTY_RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify([]) }));
const CONVERSATION_RESPONSE: Response = new Response(new ResponseOptions(
  { body: JSON.stringify(MOCKED_CONVERSATION_DATA) })
);
const componentInstance: any = { SendPhoneComponent: jasmine.createSpy('SendPhoneComponent') };

describe('Service: Conversation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversationService,
        RealTimeService,
        XmppService,
        ...TEST_HTTP_PROVIDERS,
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: InboxService, useClass: InboxServiceMock },
        { provide: InboxConversationService, useClass: InboxConversationServiceMock },
        {
          provide: BlockUserXmppService, useValue: {
            getBlockedUsers() {
              return ['1', '2', '3'];
            }
          }
        },
        {
          provide: NotificationService, useValue: {
            sendBrowserNotification() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        },
        {
          provide: ConnectionService, useValue: {}
        },
        MessageService,
        EventService,
        MsgArchiveService,
        I18nService
      ]
    });
    service = TestBed.get(ConversationService);
    inboxService = TestBed.get(InboxService);
    inboxConversationService = TestBed.get(InboxConversationService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    messageService = TestBed.get(MessageService);
    http = TestBed.get(HttpService);
    realTime = TestBed.get(RealTimeService);
    persistencyService = TestBed.get(PersistencyService);
    notificationService = TestBed.get(NotificationService);
    remoteConsoleService = TestBed.get(RemoteConsoleService);
    eventService = TestBed.get(EventService);
    trackingService = TestBed.get(TrackingService);
    connectionService = TestBed.get(ConnectionService);
    archiveService = TestBed.get(MsgArchiveService);
    modalService = TestBed.get(NgbModal);
    i18n = TestBed.get(I18nService);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('getLeads', () => {

    it('should return empty list', () => {
      service.getLeads().subscribe((leads: Conversation[]) => expect(leads).toEqual([]));
    });
  });

  describe('loadMore', () => {
    let response: Lead[];
    const LEADS: Lead[] = createConversationsArray(4);
    beforeEach(() => {
      spyOn<any>(service, 'getLastDate').and.returnValue(1234);
      spyOn(service, 'getLeads').and.returnValue(Observable.of({}));
      service.stream$.subscribe((leads: Lead[]) => {
        response = leads;
      });
      service['leads'] = LEADS;
      service.loadMore().subscribe();
    });

    it('should call getLeads', () => {
      expect(service['getLeads']).toHaveBeenCalledWith(1234);
    });

    it('should emit stream', () => {
      expect(response).toEqual(LEADS);
    });
  });

  describe('loadMoreArchived', () => {
    let response: Lead[];
    const LEADS: Lead[] = createConversationsArray(4);
    beforeEach(() => {
      spyOn<any>(service, 'getLastDate').and.returnValue(1234);
      spyOn(service, 'getLeads').and.returnValue(Observable.of({}));
      service.archivedStream$.subscribe((leads: Lead[]) => {
        response = leads;
      });
      service['archivedLeads'] = LEADS;
      service.loadMoreArchived().subscribe();
    });

    it('should call getLeads', () => {
      expect(service['getLeads']).toHaveBeenCalledWith(1234, true);
    });

    it('should emit stream', () => {
      expect(response).toEqual(LEADS);
    });
  });

  describe('getPage', () => {
    let response: Conversation[];
    beforeEach(() => {
      response = null;
    });

    describe('no archive', () => {
      it('should emit 2 conversations', () => {
        service.getPage(1).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.stream$.next(createConversationsArray(2));

        expect(response.length).toBe(2);
      });

      it('should emit 30 conversations', () => {
        service.getPage(1).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.stream$.next(createConversationsArray(40));

        expect(response.length).toBe(30);
      });

      it('should emit 45 conversations', () => {
        service.getPage(2).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.stream$.next(createConversationsArray(45));

        expect(response.length).toBe(45);
      });

      it('should emit 90 conversations', () => {
        service.getPage(3).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.stream$.next(createConversationsArray(90));

        expect(response.length).toBe(90);
      });

      it('should emit conversations event after stream', () => {
        service.stream$.next(createConversationsArray(2));

        service.getPage(1).subscribe((r: Conversation[]) => {
          response = r;
        });

        expect(response.length).toBe(2);
      });

      describe('filter', () => {
        it('should filter by expectedVisit property', () => {
          service.getPage(1, false, [{
            key: 'expectedVisit',
            value: true
          }]).subscribe((r: Conversation[]) => {
            response = r;
          });
          const conversations: Conversation[] = createConversationsArray(5);
          conversations[0]['_expectedVisit'] = true;
          conversations[2]['_expectedVisit'] = true;
          service.stream$.next(conversations);
          expect(response.length).toBe(2);
        });

        it('should filter by phone property', () => {
          service.getPage(1, false, [{
            key: 'phone',
            value: undefined
          }]).subscribe((r: Conversation[]) => {
            response = r;
          });

          service.stream$.next([...createConversationsArray(6), ...createConversationsArray(4, true)]);

          expect(response.length).toBe(6);
        });

        it('should filter by multiple properties', () => {
          service.getPage(1, false, [{
            key: 'phone',
            value: undefined
          }, {
            key: 'expectedVisit',
            value: false
          }]).subscribe((r: Conversation[]) => {
            response = r;
          });
          const conversations: Conversation[] = createConversationsArray(5);
          conversations[0]['_expectedVisit'] = true;
          conversations[2]['_expectedVisit'] = true;

          service.stream$.next([...conversations, ...createConversationsArray(4, true)]);

          expect(response.length).toBe(3);
        });
      });
    });
    describe('orderBy', () => {
      it('should order by date desc', () => {
        service.getPage(1, false).subscribe((r: Conversation[]) => {
          response = r;
        });
        let conversations: Conversation[] = [];

        conversations.push(MOCK_CONVERSATION('1', undefined, undefined, 1));
        conversations.push(MOCK_CONVERSATION('2', undefined, undefined, 2));
        conversations.push(MOCK_CONVERSATION('3', undefined, undefined, 3));
        service.stream$.next(conversations);

        expect(response[0].id).toBe('3');
        expect(response[1].id).toBe('2');
        expect(response[2].id).toBe('1');

        conversations = [];
        conversations.push(MOCK_CONVERSATION('1', undefined, undefined, 1));
        conversations.push(MOCK_CONVERSATION('2', undefined, undefined, 3));
        conversations.push(MOCK_CONVERSATION('3', undefined, undefined, 2));

        service.stream$.next(conversations);
        expect(response[0].id).toBe('2');
        expect(response[1].id).toBe('3');
        expect(response[2].id).toBe('1');
      });
    });

    describe('page size', () => {
      it('should paginate with custom page size and return first page', () => {
        service.getPage(1, false, null, 2).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.stream$.next(createConversationsArray(5));

        expect(response.length).toBe(2);
      });

      it('should paginate with custom page size and return first + second page', () => {
        service.getPage(2, false, null, 2).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.stream$.next(createConversationsArray(5));

        expect(response.length).toBe(4);
      });
    });

    describe('archive', () => {
      it('should emit 2 conversations', () => {
        service.getPage(1, true).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.archivedStream$.next(createConversationsArray(2));

        expect(response.length).toBe(2);
      });

      it('should emit 30 conversations', () => {
        service.getPage(1, true).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.archivedStream$.next(createConversationsArray(40));

        expect(response.length).toBe(30);
      });

      it('should emit 45 conversations', () => {
        service.getPage(2, true).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.archivedStream$.next(createConversationsArray(45));

        expect(response.length).toBe(45);
      });

      it('should emit 90 conversations', () => {
        service.getPage(3, true).subscribe((r: Conversation[]) => {
          response = r;
        });

        service.archivedStream$.next(createConversationsArray(90));

        expect(response.length).toBe(90);
      });
    });
  });

  describe('getTotals', () => {
    it('should return totals', () => {
      const CONVERSATIONS_WITH_PHONE: Conversation[] = createConversationsArray(4, true);
      const CONVERSATION_WITH_MEETING: Conversation = new Conversation('id', 1, CONVERSATION_DATE, true);
      const NORMAL_CONVERSATIONS: Conversation[] = createConversationsArray(6);
      let result: ConversationTotals;
      service.getTotals().subscribe((r: ConversationTotals) => {
        result = r;
      });
      const CONVERSATIONS: Conversation[] = [...CONVERSATIONS_WITH_PHONE, CONVERSATION_WITH_MEETING, ...NORMAL_CONVERSATIONS];

      service.stream$.next(CONVERSATIONS);
      service.archivedStream$.next(CONVERSATIONS);

      expect(result.phonesShared).toBe(CONVERSATIONS_WITH_PHONE.length);
      expect(result.meetings).toBe(1);
      expect(result.messages).toBe(NORMAL_CONVERSATIONS.length);
      expect(result.conversations).toBe(CONVERSATIONS.length);
      expect(result.archivedPhonesShared).toBe(CONVERSATIONS_WITH_PHONE.length);
      expect(result.archivedMeetings).toBe(1);
      expect(result.archivedMessages).toBe(NORMAL_CONVERSATIONS.length);
    });

    it('should count only as phone a conversation with phone AND meeting', () => {
      const CONVERSATIONS_WITH_PHONE: Conversation[] = createConversationsArray(4, true);
      const CONVERSATION_WITH_MEETING: Conversation = new Conversation('id', 1, CONVERSATION_DATE, true);
      const CONVERSATION_WITH_MEETING_AND_PHONE: Conversation = new Conversation('id2', 2, CONVERSATION_DATE, true, undefined, undefined, [], CONVERSATION_PHONE);
      const NORMAL_CONVERSATIONS: Conversation[] = createConversationsArray(6);
      let result: ConversationTotals;
      service.getTotals().subscribe((r: ConversationTotals) => {
        result = r;
      });
      const CONVERSATIONS: Conversation[] = [
        ...CONVERSATIONS_WITH_PHONE,
        CONVERSATION_WITH_MEETING,
        CONVERSATION_WITH_MEETING_AND_PHONE,
        ...NORMAL_CONVERSATIONS
      ];

      service.stream$.next(CONVERSATIONS);
      service.archivedStream$.next(CONVERSATIONS);

      expect(result.phonesShared).toBe(CONVERSATIONS_WITH_PHONE.length + 1);
      expect(result.meetings).toBe(1);
      expect(result.messages).toBe(NORMAL_CONVERSATIONS.length);
      expect(result.conversations).toBe(CONVERSATIONS.length);
      expect(result.archivedPhonesShared).toBe(CONVERSATIONS_WITH_PHONE.length + 1);
      expect(result.archivedMeetings).toBe(1);
      expect(result.archivedMessages).toBe(NORMAL_CONVERSATIONS.length);
    });
  });

  describe('openPhonePopup', () => {
    const conversation = MOCK_CONVERSATION();
    const modalOptions = { windowClass: 'phone-request', backdrop: 'static', keyboard: false };

    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();
    });

    it('should open phoneRequest modal when the button is clicked', () => {
      service.openPhonePopup(conversation);

      expect(modalService.open).toHaveBeenCalledWith(SendPhoneComponent, modalOptions);
    });

    it('should set the modal conversation to the currentConversation, when the modal is opened', () => {
      service['modalRef'] = <any>{ componentInstance: componentInstance };

      service.openPhonePopup(conversation);

      expect(service['modalRef'].componentInstance.conversation).toBe(conversation);
    });

    it('should call trackingService.addTrackingEvent with ITEM_SHAREPHONE_SHOWFORM when called with required TRUE', () => {
      spyOn(trackingService, 'addTrackingEvent');
      const event = {
        eventData: TrackingService.ITEM_SHAREPHONE_SHOWFORM,
        attributes: { item_id: conversation.item.id }
      };

      service.openPhonePopup(conversation, true);

      expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('archiveWithPhones', () => {
    const CONVERSATIONS_WITH_PHONE: Conversation[] = createConversationsArray(4, true);
    const NORMAL_CONVERSATIONS: Conversation[] = createConversationsArray(6);
    beforeEach(() => {
      spyOn<any>(service, 'bulkArchive');
      spyOn(service, 'sendRead');
      service.leads = [...CONVERSATIONS_WITH_PHONE, ...NORMAL_CONVERSATIONS];
      service.archiveWithPhones();
    });

    it('should call bulkArchive with conversations with phone', () => {
      expect(service['bulkArchive']).toHaveBeenCalledWith(CONVERSATIONS_WITH_PHONE);
    });

    it('should call sendRead', () => {
      expect(service.sendRead).toHaveBeenCalledTimes(CONVERSATIONS_WITH_PHONE.length);
    });
  });

  describe('onArchive', () => {
    it('should call sendRead', () => {
      spyOn(service, 'sendRead');

      const CONVERSATION: Conversation = MOCK_CONVERSATION();
      service['onArchive'](CONVERSATION);

      expect(service.sendRead).toHaveBeenCalledWith(CONVERSATION);
    });
  });

  describe('onArchiveAll', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    const RETURNED_CONVERSATIONS: Conversation[] = createConversationsArray(2);
    beforeEach(() => {
      spyOn<any>(service, 'bulkArchive').and.returnValue(RETURNED_CONVERSATIONS);
      spyOn(service, 'stream');
      spyOn(service, 'sendRead');
      service.leads = CONVERSATIONS;
      service['onArchiveAll']();
    });

    it('should call sendRead', () => {
      expect(service.sendRead).toHaveBeenCalledTimes(CONVERSATIONS.length);
    });

    it('should call bulkArchive', () => {
      expect(service['bulkArchive']).toHaveBeenCalledWith(CONVERSATIONS);
      expect(service.leads).toEqual(RETURNED_CONVERSATIONS);
    });

    it('should call streams', () => {
      expect(service.stream).toHaveBeenCalled();
    });
  });

  describe('loadMessagesIntoConversations', () => {
    let conversations: Conversation[];
    let convWithMessages: Conversation[];
    const messagesArray = createMessagesArray(7);
    describe('with normal data', () => {
      beforeEach(() => {
        messagesArray.map(m => m.status = messageStatus.RECEIVED);
        spyOn(messageService, 'getMessages').and.callFake(() => {
          return Observable.of({
            data: messagesArray,
            meta: {
              first: 'abc',
              end: false
            }
          });
        });
        convWithMessages = [];
        connectionService.isConnected = true;
        conversations = createConversationsArray(5);
      });

      it('should call messageService.getMessages', () => {
        spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.throw({ reason: 'missing' }));
        service.loadMessagesIntoConversations(conversations).subscribe((res: Conversation[]) => {
          convWithMessages = res;
        });

        expect(messageService.getMessages).toHaveBeenCalledTimes(5);
      });

      it(`should set messageService.totalUnreadMessages to the sum of conversations' unread counters,
      when messagesService.totalUnreadMessages is 0`, () => {
        spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.throw({ reason: 'missing' }));
        spyOnProperty(messageService, 'totalUnreadMessages', 'get').and.callThrough();

        service.loadMessagesIntoConversations(conversations).subscribe((res: Conversation[]) => {
          convWithMessages = res;
        });

        expect(messageService.totalUnreadMessages).toBe(35);
      });

      it(`should increment messageService.totalUnreadMessages with the sum of conversations' unread counters,
      when messagesService.totalUnreadMessages is greater than 0`, () => {
        spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.throw({ reason: 'missing' }));
        spyOnProperty(messageService, 'totalUnreadMessages', 'get').and.callThrough();
        messageService.totalUnreadMessages = 10;

        service.loadMessagesIntoConversations(conversations).subscribe((res: Conversation[]) => {
          convWithMessages = res;
        });

        expect(messageService.totalUnreadMessages).toBe(45);
      });

      it('should fill conversations with messages', () => {
        spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.throw({ reason: 'missing' }));
        service.loadMessagesIntoConversations(conversations).subscribe();

        conversations.map(c => expect(c.messages.length).toBe(7));
      });

      it('should set the lastMessageRef', () => {
        convWithMessages.forEach((conversation: Conversation) => {
          expect(conversation.lastMessageRef).toBe('abc');
        });
      });

      it('should set the oldMessagesLoaded', () => {
        convWithMessages.forEach((conversation: Conversation) => {
          expect(conversation.oldMessagesLoaded).toBe(false);
        });
      });

      it('should call loadNotStoredMessages and unsubscribe from the event when a FOUND_MESSAGES_IN_DB event is triggered,', () => {
        spyOn(service, 'loadNotStoredMessages');
        spyOn(eventService, 'unsubscribeAll');

        service.loadMessagesIntoConversations(conversations);
        eventService.emit(EventService.FOUND_MESSAGES_IN_DB);

        expect(service.loadNotStoredMessages).toHaveBeenCalled();
        expect(eventService.unsubscribeAll).toHaveBeenCalledWith(EventService.FOUND_MESSAGES_IN_DB);
      });
    });

    describe('with null conversation data', () => {
      it('should return an observable of null', () => {
        let observableResponse: any;
        connectionService.isConnected = true;

        service.loadMessagesIntoConversations(null).subscribe((r: any) => {
          observableResponse = r;
        });

        expect(observableResponse).toBe(null);
      });
    });
  });

  describe('getConversationPage', () => {
    describe('no archive', () => {
      it('should return the page number where is a conversation', () => {
        service.leads = createConversationsArray(60);

        const page: number = service.getConversationPage('34');

        expect(page).toBe(2);
      });

      it('should return the page number where is a conversation', () => {
        service.leads = createConversationsArray(5);

        const page: number = service.getConversationPage('4');

        expect(page).toBe(1);
      });

      it('should return the page number where is a conversation', () => {
        service.leads = createConversationsArray(60);

        const page: number = service.getConversationPage('60');

        expect(page).toBe(2);
      });

      it('should return the page number where is a conversation', () => {
        service.leads = createConversationsArray(5);

        const page: number = service.getConversationPage('1');

        expect(page).toBe(1);
      });

      it('should return -1 if conversation not found', () => {
        service.leads = createConversationsArray(5);

        const page: number = service.getConversationPage('a');

        expect(page).toBe(-1);
      });
    });

    describe('archive', () => {
      it('should return the page number where is a conversation', () => {
        service.archivedLeads = createConversationsArray(60);

        const page: number = service.getConversationPage('34', true);

        expect(page).toBe(2);
      });

      it('should return the page number where is a conversation', () => {
        service.archivedLeads = createConversationsArray(5);

        const page: number = service.getConversationPage('4', true);

        expect(page).toBe(1);
      });

      it('should return the page number where is a conversation', () => {
        service.archivedLeads = createConversationsArray(60);

        const page: number = service.getConversationPage('60', true);

        expect(page).toBe(2);
      });

      it('should return the page number where is a conversation', () => {
        service.archivedLeads = createConversationsArray(5);

        const page: number = service.getConversationPage('1', true);

        expect(page).toBe(1);
      });

      it('should return -1 if conversation not found', () => {
        service.archivedLeads = createConversationsArray(5);

        const page: number = service.getConversationPage('a');

        expect(page).toBe(-1);
      });
    });

  });

  describe('processChatSignals', () => {
    const timestamp = new Date(MOCK_MESSAGE.date).getTime();

    describe('when processing read signals', () => {
      let mockedConversation: Conversation;
      let expectedMarkedAsRead, expectedNotMarkedAsRead;
      const unreadCount = 5;
      mockedConversation = MOCK_CONVERSATION();
      mockedConversation.messages = createMessagesArray(10);
      beforeEach(() => {
        spyOn(persistencyService, 'updateMessageStatus');
        spyOn(trackingService, 'addTrackingEvent');
        service.leads.push(mockedConversation);
        messageService.totalUnreadMessages = unreadCount;
        mockedConversation.unreadMessages = unreadCount;
      });
      describe('when the signal ID does not match any message ID in the conversation', () => {
        const signal = new ChatSignal(chatSignalType.READ, 'non-existant-conv-id', timestamp);
        it('should NOT call trackingService.addTrackingEvent', () => {
          service.processChatSignal(signal);

          expect(trackingService.addTrackingEvent).not.toHaveBeenCalled();
        });

        it('should NOT call persistencyService.updateMessageStatus', () => {
          service.processChatSignal(signal);

          expect(persistencyService.updateMessageStatus).not.toHaveBeenCalled();
        });
      });

      describe('when processing a READ chat signal NOT fromSelf', () => {
        it(`should update status to READ and push tracking event MESSAGE_READ for messages fromSelf and status RECEIVED`, () => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? true : false;
            m.status = messageStatus.RECEIVED;
          });
          expectedMarkedAsRead = mockedConversation.messages.filter(m => m.fromSelf && (m.status === messageStatus.SENT || m.status === messageStatus.RECEIVED));
          expectedNotMarkedAsRead = mockedConversation.messages.filter(m => !m.fromSelf);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processChatSignal(signal);

          const attributes = {
            thread_id: mockedConversation.id,
            message_id: null
          };

          expect(persistencyService.updateMessageStatus).toHaveBeenCalledTimes(unreadCount);
          expectedMarkedAsRead.forEach(m => {
            attributes.message_id = m.id;
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({
              eventData: TrackingService.MESSAGE_READ,
              attributes: attributes
            }, false);
            expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(m, messageStatus.READ);
          });

          expectedNotMarkedAsRead.forEach(m => {
            attributes.message_id = m.id;
            expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({
              eventData: TrackingService.MESSAGE_READ,
              attributes: attributes
            }, false);
            expect(persistencyService.updateMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.READ);
          });
        });

        it(`should update status to READ and push tracking event MESSAGE_READ for messages fromSelf and status SENT`, () => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? true : false;
            m.status = messageStatus.SENT;
          });
          expectedMarkedAsRead = mockedConversation.messages.filter(m => m.fromSelf && (m.status === messageStatus.SENT || m.status === messageStatus.RECEIVED));
          expectedNotMarkedAsRead = mockedConversation.messages.filter(m => !m.fromSelf);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processChatSignal(signal);

          const attributes = {
            thread_id: mockedConversation.id,
            message_id: null
          };

          expect(persistencyService.updateMessageStatus).toHaveBeenCalledTimes(unreadCount);
          expectedMarkedAsRead.forEach(m => {
            attributes.message_id = m.id;
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({
              eventData: TrackingService.MESSAGE_READ,
              attributes: attributes
            }, false);
            expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(m, messageStatus.READ);
          });

          expectedNotMarkedAsRead.forEach(m => {
            attributes.message_id = m.id;
            expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({
              eventData: TrackingService.MESSAGE_READ,
              attributes: attributes
            }, false);
            expect(persistencyService.updateMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.READ);
          });
        });

        it(`should NOT update status to READ and NOT push tracking event MESSAGE_READ for messages fromSelf and status PENDING`, () => {
          mockedConversation.messages.map((m, index) => {
            m.fromSelf = index < unreadCount ? true : false;
            m.status = messageStatus.PENDING;
          });

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processChatSignal(signal);

          expect(persistencyService.updateMessageStatus).not.toHaveBeenCalled();
          expect(persistencyService.updateMessageStatus).not.toHaveBeenCalled();
        });

        it('should NOT decrase the unreadMessages counter of the conversation', () => {
          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processChatSignal(signal);

          expect(mockedConversation.unreadMessages).toBe(unreadCount);
        });

        it('should NOT decrease messageService.totalUnreadMessages counter', () => {
          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, false);
          service.processChatSignal(signal);

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

        it(`should update status to READ and push tracking events MESSAGE_READ_ACK for messages NOT fromSelf`, () => {
          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processChatSignal(signal);

          const attributes = {
            thread_id: mockedConversation.id,
            message_id: null
          };

          expect(persistencyService.updateMessageStatus).toHaveBeenCalledTimes(unreadCount);
          expectedMarkedAsRead.forEach(m => {
            attributes.message_id = m.id;
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({
              eventData: TrackingService.MESSAGE_READ_ACK,
              attributes: attributes
            }, false);
            expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(m, messageStatus.READ);
          });

          expectedNotMarkedAsRead.forEach(m => {
            attributes.message_id = m.id;
            expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({
              eventData: TrackingService.MESSAGE_READ_ACK,
              attributes: attributes
            }, false);
            expect(persistencyService.updateMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.READ);
          });
        });

        it('should decrase the unreadMessages counter of the conversation by the number of messages that are being marked as READ', () => {
          expect(mockedConversation.unreadMessages).toBe(unreadCount);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processChatSignal(signal);

          expect(mockedConversation.unreadMessages).toBe(0);
        });

        it(`should set unreadMessages counter of the conversation to 0 if the number of messages that are being marked as READ is greater
        than the existing counter (disallow negative values in counter)`, () => {
          mockedConversation.unreadMessages = 1;

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processChatSignal(signal);

          expect(mockedConversation.unreadMessages).toBe(0);
        });

        it('should decrase messageService.totalUnreadMessages counter by the number of messages that are being marked as READ', () => {
          expect(mockedConversation.unreadMessages).toBe(unreadCount);

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processChatSignal(signal);

          expect(messageService.totalUnreadMessages).toBe(0);
        });

        it(`should set messageService.totalUnreadMessages counter to 0 if the number of messages that are being marked as READ is greater
        than the existing counter (disallow negative values in counter)`, () => {
          mockedConversation.unreadMessages = 1;

          const signal = new ChatSignal(chatSignalType.READ, mockedConversation.id, Date.now(), null, true);
          service.processChatSignal(signal);

          expect(messageService.totalUnreadMessages).toBe(0);
        });
      });
    });

    describe('when processing sent and received signals', () => {
      const mockedConversation = MOCK_CONVERSATION();
      beforeEach(() => {
        spyOn(persistencyService, 'updateMessageStatus');
        spyOn(trackingService, 'addTrackingEvent');
        service.leads.push(mockedConversation);
      });

      describe('when called with a thread that does not match any conversation ID', () => {
        mockedConversation.messages = [MOCK_MESSAGE];
        const sentSignal = new ChatSignal(chatSignalType.SENT, 'non-existant-thread', timestamp, MOCK_MESSAGE.id);

        it('should NOT call trackingService.addTrackingEvent', () => {
          service.processChatSignal(sentSignal);

          expect(trackingService.addTrackingEvent).not.toHaveBeenCalled();
        });

        it('should NOT call persistencyService.updateMessageStatus', () => {
          service.processChatSignal(sentSignal);

          expect(persistencyService.updateMessageStatus).not.toHaveBeenCalled();
        });
      });

      describe('when called with a messageId does not match any message ID in the conversation', () => {
        mockedConversation.messages = [MOCK_MESSAGE];
        const sentSignal = new ChatSignal(chatSignalType.SENT, mockedConversation.id, timestamp, 'non-existant-id');

        it('should NOT call trackingService.addTrackingEvent', () => {
          service.processChatSignal(sentSignal);

          expect(trackingService.addTrackingEvent).not.toHaveBeenCalled();
        });

        it('should NOT call persistencyService.updateMessageStatus', () => {
          service.processChatSignal(sentSignal);

          expect(persistencyService.updateMessageStatus).not.toHaveBeenCalled();
        });
      });

      it(`should update message status and add a tracking event ONLY for messages that meet the criteria:
        message status is missing OR message status is NULL OR the new status order is greater than the current status order`, () => {
        mockedConversation.messages = [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE, MOCK_MESSAGE_FROM_OTHER];
        mockedConversation.messages[0].status = messageStatus.SENT;
        mockedConversation.messages[1].status = null;
        mockedConversation.messages[2].status = messageStatus.RECEIVED;
        service.leads.push(mockedConversation);
        const attributes = {
          thread_id: mockedConversation.id,
          message_id: null
        };

        const signal1 = new ChatSignal(chatSignalType.RECEIVED, mockedConversation.id, timestamp, mockedConversation.messages[0].id);
        const signal2 = new ChatSignal(chatSignalType.RECEIVED, mockedConversation.id, timestamp, mockedConversation.messages[1].id);
        const signal3 = new ChatSignal(chatSignalType.SENT, mockedConversation.id, timestamp, mockedConversation.messages[2].id);

        service.processChatSignal(signal1);
        service.processChatSignal(signal2);
        service.processChatSignal(signal3);

        const expectedChangedMessages = mockedConversation.messages.slice(0, 2);
        const expectedNotChangedMessages = mockedConversation.messages.slice(-1);

        expect(persistencyService.updateMessageStatus).toHaveBeenCalledTimes(2);
        expectedChangedMessages.forEach(m => {
          attributes.message_id = m.id;
          expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({
            eventData: TrackingService.MESSAGE_RECEIVED,
            attributes: attributes
          }, false);
          expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(m, messageStatus.RECEIVED);
        });

        expectedNotChangedMessages.forEach(m => {
          attributes.message_id = m.id;
          expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({
            eventData: TrackingService.MESSAGE_SENT,
            attributes: attributes
          }, false);
          expect(persistencyService.updateMessageStatus).not.toHaveBeenCalledWith(m, messageStatus.SENT);
        });
      });
    });
  });

  describe('get', () => {
    it('should return the requested conversation info and map the user and item data', () => {
      spyOn(http, 'get').and.returnValue(Observable.of(CONVERSATION_RESPONSE));
      let mappedResponse: any;

      service.get(MOCKED_CONVERSATION_DATA.id).subscribe((response) => {
        mappedResponse = response;
      });

      expect(mappedResponse.item instanceof Item).toBe(true);
      expect(mappedResponse.user instanceof User).toBe(true);
      expect(mappedResponse.user.itemDistance).toBe(USER_ITEM_DISTANCE);
      expect(mappedResponse.user.blocked).toEqual(MOCK_USER.blocked);
    });

    it('should return an empty array if no data', () => {
      spyOn(http, 'get').and.returnValues(Observable.of(EMPTY_RESPONSE));
      let conversations: Conversation[];
      connectionService.isConnected = true;

      service.query().subscribe((res: Conversation[]) => {
        conversations = res;
      });

      expect(conversations instanceof Array).toBe(true);
      expect(conversations.length).toBe(0);
    });
  });

  describe('sendRead', () => {

    let conversation: Conversation;

    beforeEach(() => {
      spyOn(realTime, 'sendRead');
      spyOn(trackingService, 'track');
      conversation = MOCK_CONVERSATION();
      service.leads = [conversation];
    });

    it('should call processChatsignal with a READ signal when a MESSAGE_READ_ACK event is triggered', () => {
      spyOn(service, 'processChatSignal');
      conversation.messages = [MOCK_MESSAGE, MOCK_MESSAGE, MOCK_RANDOM_MESSAGE, MOCK_MESSAGE];
      conversation.unreadMessages = 2;
      const readSignalFromSelf = new ChatSignal(chatSignalType.READ, conversation.id, null, null, true);

      service.sendRead(conversation);
      eventService.emit(EventService.MESSAGE_READ_ACK);

      expect(service.processChatSignal).toHaveBeenCalledWith(readSignalFromSelf);
    });

    it('should call realTime.sendRead', () => {
      conversation.unreadMessages = 2;

      service.sendRead(conversation);

      expect(realTime.sendRead).toHaveBeenCalledWith(USER_ID, CONVERSATION_ID);
    });

    it('should set conversation.unreadMessages to 0', () => {
      conversation.unreadMessages = 2;

      service.sendRead(conversation);

      expect(conversation.unreadMessages).toBe(0);
    });

    it('should decrement totalUnreadMessages', () => {
      conversation.unreadMessages = 5;
      messageService.totalUnreadMessages = 10;

      service.sendRead(conversation);

      expect(messageService.totalUnreadMessages).toBe(5);

      conversation.unreadMessages = 10;
      messageService.totalUnreadMessages = 10;

      service.sendRead(conversation);

      expect(messageService.totalUnreadMessages).toBe(0);

      conversation.unreadMessages = 10;
      messageService.totalUnreadMessages = 5;

      service.sendRead(conversation);

      expect(messageService.totalUnreadMessages).toBe(0);
    });

    it('should NOT call realTime.sendRead, NOR processChatSignal if conversation.unreadMessages is 0', () => {
      spyOn(service, 'processChatSignal');
      conversation.unreadMessages = 0;

      service.sendRead(conversation);
      eventService.emit(EventService.MESSAGE_READ_ACK);

      expect(realTime.sendRead).not.toHaveBeenCalled();
      expect(service.processChatSignal).not.toHaveBeenCalled();
    });

  });

  describe('loadNotStoredMessages', () => {
    it('should call messageService.getNotSavedMessages', () => {
      spyOn(messageService, 'getNotSavedMessages').and.returnValue(Observable.of({}));
      const conversations = createConversationsArray(5);

      service.loadNotStoredMessages(conversations, true);

      expect(messageService.getNotSavedMessages).toHaveBeenCalledWith(conversations, true);
    });
  });

  describe('getItemFromThread', () => {
    it('should return item', () => {
      service.leads = createConversationsArray(4);

      const item: Item = service.getItemFromThread('2');

      expect(item instanceof Item).toBe(true);
      expect(item.id).toBe(ITEM_ID);
    });
  });

  describe('getSingleConversationMessages', () => {
    it('should call messageService.getMessages, return the conversation with messages and emit a CHAT_CAN_PROCESS_RT event with true',
      fakeAsync(() => {
        spyOn(messageService, 'getMessages').and.returnValue(Observable.of({ data: [MOCK_MESSAGE, MOCK_RANDOM_MESSAGE] }));
        spyOn(eventService, 'emit');
        let conversation = SECOND_MOCK_CONVERSATION;
        const expectedConversation = SECOND_MOCK_CONVERSATION;
        expectedConversation.messages = [MOCK_MESSAGE, MOCK_RANDOM_MESSAGE];

        service.getSingleConversationMessages(conversation).subscribe(response => conversation = response);
        tick();

        expect(messageService.getMessages).toHaveBeenCalled();
        expect(conversation).toEqual(expectedConversation);
        expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, true);
      }));

    it('should emit a REQUEST_PHONE event when the conversation has no messages AND getPhoneInfo returns a phone method type',
      fakeAsync(() => {
        const RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify(MOCK_CONVERSATION()) }));
        spyOn(http, 'post').and.returnValue(Observable.of(RESPONSE));
        spyOn(userService, 'get').and.returnValue(Observable.of({}));
        spyOn(itemService, 'get').and.returnValue(Observable.of({}));
        spyOn(userService, 'getPhoneInfo').and.returnValue(Observable.of({ phone_method: phoneMethod.chatMessage }));
        spyOn(messageService, 'getMessages').and.returnValue(Observable.of({ data: [] }));
        spyOn(eventService, 'emit');
        let conversation = MOCK_CONVERSATION();

        service.getSingleConversationMessages(conversation).subscribe(response => conversation = response);
        tick();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.REQUEST_PHONE, phoneMethod.chatMessage);
      }));
  });

});

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
import { Message, messageStatus, phoneMethod } from '../message/message';
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
  MOCK_NOT_FOUND_CONVERSATION,
  NOT_FOUND_CONVERSATION_ID,
  SECOND_MOCK_CONVERSATION,
  SURVEY_RESPONSES
} from '../../../tests/conversation.fixtures.spec';
import {
  MOCK_OTHER_USER,
  MOCK_USER,
  MockedUserService,
  OTHER_USER_ID,
  USER_ID,
  USER_ITEM_DISTANCE
} from '../../../tests/user.fixtures.spec';
import { ITEM_ID, MOCK_ITEM, MockedItemService } from '../../../tests/item.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import {
  createMessagesArray,
  MESSAGE_MAIN,
  MESSAGE_MAIN_UPDATED,
  MOCK_MESSAGE,
  MOCK_MESSAGE_FROM_OTHER,
  MOCK_RANDOM_MESSAGE
} from '../../../tests/message.fixtures.spec';
import { MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';
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
import { MockRemoteConsoleService } from '../../../tests';
import { InboxService } from '../inbox/inbox.service';

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
let modalService: NgbModal;
let archiveService: MsgArchiveService;
let i18n: I18nService;

const MOCKED_CONVERSATION_DATA: any = CONVERSATIONS_DATA[0];
const EMPTY_RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify([]) }));
const CONVERSATION_RESPONSE: Response = new Response(new ResponseOptions(
  { body: JSON.stringify(MOCKED_CONVERSATION_DATA) })
);
const componentInstance: any = { SendPhoneComponent: jasmine.createSpy('SendPhoneComponent') };

class MockedInboxService {
  public getInboxFeatureFlag$(): Observable<boolean> {
    return Observable.of(false);
  }
}

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
        { provide: InboxService, useClass: MockedInboxService },
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

  describe('checkIfLastPage', () => {
    it('should call endpoint with lastDate', () => {
      const RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify(createConversationsArray(2)) }));
      spyOn(http, 'get').and.returnValue(Observable.of(RESPONSE));
      spyOn<any>(service, 'getLastDate').and.returnValue(12345);

      service.checkIfLastPage().subscribe();

      expect(http.get).toHaveBeenCalledWith('api/v3/protool/conversations', {
        until: 12345,
        hidden: false
      });
    });

    it('should set ended.pending to TRUE when called without any argument', () => {
      const RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify([]) }));
      spyOn(http, 'get').and.returnValue(Observable.of(RESPONSE));
      spyOn<any>(service, 'getLastDate').and.returnValue(12345);

      service.checkIfLastPage().subscribe();

      expect(service.ended.pending).toBe(true);
    });

    it('should set ended.pending to TRUE when called with false', () => {
      const RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify([]) }));
      spyOn(http, 'get').and.returnValue(Observable.of(RESPONSE));
      spyOn<any>(service, 'getLastDate').and.returnValue(12345);

      service.checkIfLastPage().subscribe();

      expect(service.ended.pending).toBe(true);
    });

    it('should set ended.processed to TRUE when called with true', () => {
      const RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify([]) }));
      spyOn(http, 'get').and.returnValue(Observable.of(RESPONSE));
      spyOn<any>(service, 'getLastDate').and.returnValue(12345);

      service.checkIfLastPage(true).subscribe();

      expect(service.ended.processed).toBe(true);
    });

    it('should do not call endpoint', () => {
      spyOn(http, 'get');
      spyOn<any>(service, 'getLastDate').and.returnValue(null);

      service.checkIfLastPage().subscribe();

      expect(http.get).not.toHaveBeenCalled();
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

  describe('getByItemId', () => {
    it('should call the endpoint', () => {
      spyOn(http, 'get').and.callThrough();

      service.getByItemId(MOCK_ITEM.id);

      expect(http.get).toHaveBeenCalledWith(`api/v3/items/${MOCK_ITEM.id}/conversation`);
    });
  });

  describe('createConversation', () => {
    it('should make a post request to the conversations endpoint', () => {
      spyOn(http, 'post').and.returnValue(Observable.of({}));
      const options = new RequestOptions();
      options.headers = new Headers();
      options.headers.append('Content-Type', 'application/json');

      service.createConversation(MOCK_CONVERSATION().item.id);

      expect(http.post).toHaveBeenCalledWith('api/v3/conversations', JSON.stringify({ item_id: MOCK_CONVERSATION().item.id }), options);
    });

    it('should call userService.getPhoneInfo with the other_user_id of the conversations', fakeAsync(() => {
      const RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify(MOCK_CONVERSATION()) }));
      spyOn(http, 'post').and.returnValue(Observable.of(RESPONSE));
      spyOn(userService, 'get').and.returnValue(Observable.of({}));
      spyOn(itemService, 'get').and.returnValue(Observable.of({}));
      spyOn(userService, 'getPhoneInfo').and.returnValue(Observable.of({}));

      service.createConversation(MOCK_CONVERSATION().item.id).subscribe();
      tick();

      expect(userService.getPhoneInfo).toHaveBeenCalledWith(MOCK_CONVERSATION().other_user_id);
    }));
  });

  describe('handleNewMessages', () => {

    beforeEach(() => {
      service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
      inboxService.conversations = [MOCK_INBOX_CONVERSATION];
      expect(service.leads[0].messages.length).toEqual(0);
      service.firstLoad = false;
    });

    afterEach(() => {
      if (service.leads && service.leads[0]) {
        service.leads[0].messages = [];
        service.leads[0].unreadMessages = 0;
      }
      messageService.totalUnreadMessages = 0;
    });

    describe('conversation present', () => {
      it('should add a message to the right conversation', () => {
        service.handleNewMessages(MOCK_MESSAGE, false);

        expect(service.leads[0].id).toEqual(MESSAGE_MAIN.thread);
        expect(service.leads[0].messages.length).toEqual(1);
        expect(service.leads[0].messages[0].thread).toEqual(MESSAGE_MAIN.thread);
        expect(service.leads[0].messages[0].message).toEqual(MESSAGE_MAIN.body);
        expect(service.leads[0].messages[0] instanceof Message).toBe(true);
        expect(service.leads[1].messages.length).toEqual(0);
      });

      it('should add a new MESSAGE_RECEIVED_ACK event to pendingTrackingEvents when a new message is received', () => {
        spyOn(trackingService, 'addTrackingEvent');
        const message = new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, MESSAGE_MAIN.body, OTHER_USER_ID, MESSAGE_MAIN_UPDATED.date);
        message.user = MOCK_USER;

        service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
        (service as any).onNewMessage(message, true);
        eventService.emit(EventService.MESSAGE_RECEIVED_ACK);

        expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({
          eventData: TrackingService.MESSAGE_RECEIVED_ACK,
          attributes: {
            thread_id: MESSAGE_MAIN.thread,
            message_id: MESSAGE_MAIN.id
          }
        }, false);
      });

      it('should NOT track MESSAGE_RECEIVED_ACK when the recepit has already been sent', () => {
        spyOn(trackingService, 'track');
        const message = new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, MESSAGE_MAIN.body, OTHER_USER_ID, MESSAGE_MAIN_UPDATED.date);
        message.user = MOCK_USER;
        service['receiptSent'] = true;

        service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
        (service as any).onNewMessage(message, true);

        expect(trackingService.track).not.toHaveBeenCalled();
      });

      it('should emit MESSAGE_ADDED event', () => {
        spyOn(eventService, 'emit');
        service.handleNewMessages(MOCK_MESSAGE, false);

        expect(eventService.emit).toHaveBeenCalled();
        expect(eventService.emit['calls'].argsFor(0)[0]).toEqual(EventService.MESSAGE_ADDED);
      });

      it('should NOT add the same message twice', () => {
        service.handleNewMessages(MOCK_MESSAGE, false);

        expect(service.leads[0].messages.length).toEqual(1);
      });

      it('should add the messages with different IDs', () => {
        service.handleNewMessages(MOCK_MESSAGE, false);
        service.handleNewMessages(MOCK_RANDOM_MESSAGE, false);

        expect(service.leads[0].messages.length).toEqual(2);
        expect(service.leads[0].messages[1].id).toEqual(MOCK_RANDOM_MESSAGE.id);
      });

      it('should call the on new message with updateDate set to true if it is an update message', () => {
        spyOn<any>(service, 'onNewMessage');

        service.handleNewMessages(MOCK_RANDOM_MESSAGE, true);

        expect((service as any).onNewMessage).toHaveBeenCalledWith(MOCK_RANDOM_MESSAGE, true);
      });

      describe('unread messages', () => {
        beforeEach(() => {
          const mockMessage = MOCK_MESSAGE_FROM_OTHER;
          service.handleNewMessages(MOCK_MESSAGE_FROM_OTHER, false);
        });

        it('should increment unreadMessages and totalUnreadMessages by 1', () => {
          expect(service.leads[0].unreadMessages).toBe(1);
          expect(messageService.totalUnreadMessages).toBe(1);
        });

        it('should increment unreadMessages and totalUnreadMessages by 2', () => {
          spyOn(remoteConsoleService, 'sendPresentationMessageTimeout');

          service.handleNewMessages(new Message(
            'new',
            MESSAGE_MAIN.thread,
            MESSAGE_MAIN.body,
            OTHER_USER_ID + '@host',
            MESSAGE_MAIN.date
          ), false);

          expect(remoteConsoleService.sendPresentationMessageTimeout).toHaveBeenCalled();
          expect(service.leads[0].unreadMessages).toBe(2);
          expect(messageService.totalUnreadMessages).toBe(2);
        });

        it('should not increment unreadMessages and totalUnreadMessages more if user is not fromSelf', () => {
          service.handleNewMessages(MOCK_MESSAGE, false);

          expect(service.leads[0].unreadMessages).toBe(1);
          expect(messageService.totalUnreadMessages).toBe(1);
        });
      });

      describe('updateConversation', () => {
        const PHONE = '823748484';
        beforeEach(() => {
          const RESPONSE: Response = new Response(new ResponseOptions(
            {
              body: JSON.stringify({
                buyer_phone_number: PHONE,
                survey_responses: SURVEY_RESPONSES
              })
            })
          );
          spyOn(http, 'get').and.returnValue(Observable.of(RESPONSE));
          service.leads = [MOCK_CONVERSATION()];
        });

        it('should update conversation if the message is the phone sharing', () => {
          service['onNewMessage'](new Message(
            MESSAGE_MAIN.id,
            MESSAGE_MAIN.thread,
            service['PHONE_MESSAGE'] + ' ' + PHONE,
            MESSAGE_MAIN.from,
            MESSAGE_MAIN.date
          ), false);

          expect(service.leads[0].phone).toBe(PHONE);
        });

        it('should update conversation if the message is the survey', () => {
          service['onNewMessage'](new Message(
            MESSAGE_MAIN.id,
            MESSAGE_MAIN.thread,
            service['SURVEY_MESSAGE'],
            MESSAGE_MAIN.from,
            MESSAGE_MAIN.date
          ), false);

          expect(service.leads[0].surveyResponses).toEqual(SURVEY_RESPONSES);
        });
      });

    });

    it('should wait to call onNewMessage if loading', fakeAsync(() => {
      spyOn<any>(service, 'onNewMessage');
      inboxService.conversations = null;
      service.handleNewMessages(MOCK_MESSAGE, false);

      expect(service['onNewMessage']).not.toHaveBeenCalled();
      tick(1000);

      expect(service['onNewMessage']).not.toHaveBeenCalled();

      inboxService.conversations = [MOCK_INBOX_CONVERSATION];
      tick(500);

      expect(service['onNewMessage']).toHaveBeenCalled();
    }));

    it('should call addUserInfo', () => {
      const messageWithUser: Message = MOCK_MESSAGE;
      spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);

      service.handleNewMessages(MOCK_MESSAGE, false);

      expect(messageService.addUserInfo).toHaveBeenCalledTimes(1);
      expect(service.leads[0].messages[0]).toEqual(messageWithUser);
    });

    it('should bump the conversation to the top if it is not already on the top, and emit a CONVERSATION_BUMPED event', () => {
      expect(service.leads[0].id).toBe(CONVERSATION_ID);
      expect(service.leads[1].id).toBe(SECOND_MOCK_CONVERSATION.id);
      spyOn(eventService, 'emit');

      service.handleNewMessages(
        new Message(MESSAGE_MAIN.id, SECOND_MOCK_CONVERSATION.id, MESSAGE_MAIN.body, MESSAGE_MAIN.from, MESSAGE_MAIN.date),
        false);

      expect(service.leads[0].id).toBe(SECOND_MOCK_CONVERSATION.id);
      expect(service.leads[1].id).toBe(CONVERSATION_ID);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_BUMPED, [service.leads[0], service.leads[1]]);
    });

    it('should send browser notification', () => {
      spyOn(notificationService, 'sendBrowserNotification');
      const messageWithUser: Message = <Message>{
        ...MOCK_MESSAGE,
        user: MOCK_USER,
        fromSelf: false
      };
      spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);

      service.handleNewMessages(MOCK_MESSAGE, false);

      expect(notificationService.sendBrowserNotification).toHaveBeenCalledWith(messageWithUser, ITEM_ID);
    });

    it('should NOT send browser notification if message is mine', () => {
      spyOn(notificationService, 'sendBrowserNotification');
      const messageWithUser: Message = <Message>{
        ...MOCK_MESSAGE,
        user: MOCK_USER,
        fromSelf: true
      };
      spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);

      service.handleNewMessages(MOCK_MESSAGE, false);

      expect(notificationService.sendBrowserNotification).not.toHaveBeenCalled();
    });

    it('should update the message date if the parameter is set', () => {
      service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];

      service.handleNewMessages(MOCK_MESSAGE, false);
      service.handleNewMessages(new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, MESSAGE_MAIN.body,
        MESSAGE_MAIN.from, MESSAGE_MAIN_UPDATED.date), true);

      expect(service.leads[0].messages[0].date).toBe(MESSAGE_MAIN_UPDATED.date);
    });

    it('should not save the message if there is no text, no update date && messageToUpdate', () => {
      spyOn(persistencyService, 'saveMessages');
      spyOn(persistencyService, 'updateMessageDate');
      spyOn(persistencyService, 'updateMessageStatus');
      service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];

      service.handleNewMessages(new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, null, MESSAGE_MAIN.from,
        MESSAGE_MAIN_UPDATED.date), true);

      expect(service.leads[0].messages.length).toBe(0);
      expect(persistencyService.saveMessages).not.toHaveBeenCalled();
      expect(persistencyService.updateMessageDate).not.toHaveBeenCalled();
      expect(persistencyService.updateMessageStatus).not.toHaveBeenCalled();
    });

    describe('conversation is archived', () => {
      const mockedConversation = MOCK_CONVERSATION();

      beforeEach(() => {
        spyOn(trackingService, 'addTrackingEvent');
        service.leads = [];
        inboxService.conversations = [MOCK_INBOX_CONVERSATION];
        service.archivedLeads = [mockedConversation, SECOND_MOCK_CONVERSATION];
      });

      afterEach(() => {
        mockedConversation.messages = [];
      });

      it('should add the message to the conversation, if it does not already exist', () => {
        service.handleNewMessages(MOCK_MESSAGE, false);

        expect(service.leads[0].messages).toContain(MOCK_MESSAGE);
      });

      it('should NOT add the message to the conversation, if it already exists in the conversation', () => {
        service.archivedLeads[0].messages.push(MOCK_MESSAGE);

        service.handleNewMessages(MOCK_MESSAGE, false);
        const countMessages = service.leads[0].messages.filter(m => m.id === MOCK_MESSAGE.id).length;

        expect(countMessages).toBe(1);
      });

      it('should call addUserInfo', () => {
        const messageWithUser: Message = MOCK_MESSAGE;
        messageWithUser.user = MOCK_USER;
        spyOn(service, 'getSingleConversationMessages').and.returnValue(Observable.of([]));
        spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);
        const newMessage: Message = new Message(
          MESSAGE_MAIN.id,
          mockedConversation.id,
          MESSAGE_MAIN.body,
          MESSAGE_MAIN.from,
          MESSAGE_MAIN.date);

        service.handleNewMessages(newMessage, false);

        expect(messageService.addUserInfo).toHaveBeenCalledTimes(1);
        expect(messageService.addUserInfo).toHaveBeenCalledWith(mockedConversation, newMessage);
        expect(service.leads[0].messages[0]).toEqual(messageWithUser);
      });

      it('should unarchive the conversation', () => {
        spyOn(eventService, 'emit');

        service['onNewMessage'](MOCK_MESSAGE, false);

        expect(service.leads.length).toBe(1);
        expect(service.leads[0].messages[0]).toEqual(MOCK_MESSAGE);
        expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_UNARCHIVED);
      });

      it('should add the conversation to the top', () => {
        service.handleNewMessages(MOCK_MESSAGE, false);

        expect(service.leads[0].id).toBe(mockedConversation.id);
      });

      it('should subscribe to the MESSAGE_RECEIVED_ACK event if the messages if not fromSelf', () => {
        spyOn(eventService, 'subscribe').and.callThrough();
        const message = new Message(MESSAGE_MAIN.id, mockedConversation.id, MESSAGE_MAIN.body, MOCK_OTHER_USER.id, MESSAGE_MAIN.date);

        service.handleNewMessages(message, false);

        expect(eventService.subscribe['calls'].argsFor(0)[0]).toBe(EventService.MESSAGE_RECEIVED_ACK);
      });

      it(`should add a MESSAGE_RECEIVED_ACK event to the pendingTrackingEvents
          if message is not fromSelf and the MESSAGE_RECEIVED_ACK event is triggered`, () => {
        const message = new Message(MESSAGE_MAIN.id, mockedConversation.id, MESSAGE_MAIN.body, MOCK_OTHER_USER.id, MESSAGE_MAIN.date);

        service.handleNewMessages(message, false);
        eventService.emit(EventService.MESSAGE_RECEIVED_ACK);

        expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({
          eventData: TrackingService.MESSAGE_RECEIVED_ACK,
          attributes: {
            thread_id: message.thread,
            message_id: message.id
          }
        }, false);
      });

    });

    describe('conversation NOT present', () => {
      const message = new Message(MESSAGE_MAIN.id, NOT_FOUND_CONVERSATION_ID, MESSAGE_MAIN.body, MESSAGE_MAIN.from, MESSAGE_MAIN.date);
      it('should request the conversation info, request its messages and add it to the list', () => {
        spyOn(service, 'get').and.returnValue(Observable.of(MOCK_NOT_FOUND_CONVERSATION));
        spyOn(service, 'getSingleConversationMessages').and.callThrough();
        spyOn(messageService, 'getMessages').and.returnValue(Observable.of({ data: [message] }));
        inboxService.conversations = [MOCK_INBOX_CONVERSATION];

        service.handleNewMessages(message, false);
        const newConversation: Conversation = <Conversation>service.leads[0];

        expect(service.get).toHaveBeenCalledWith(NOT_FOUND_CONVERSATION_ID);
        expect(newConversation.id).toBe(NOT_FOUND_CONVERSATION_ID);
        expect(newConversation.messages.length).toBe(1);
        expect(newConversation.messages[0].id).toBe(message.id);
      });
    });
  });

  describe('getSingleConversationMessages', () => {
    it('should call messageService.getMessages, return the conversation with messages and emit a CHAT_CAN_PROCESS_RT event with true', fakeAsync(() => {
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

    it('should emit a REQUEST_PHONE event when the conversation has no messages AND getPhoneInfo returns a phone method type', fakeAsync(() => {
      const RESPONSE: Response = new Response(new ResponseOptions({ body: JSON.stringify(MOCK_CONVERSATION()) }));
      spyOn(http, 'post').and.returnValue(Observable.of(RESPONSE));
      spyOn(userService, 'get').and.returnValue(Observable.of({}));
      spyOn(itemService, 'get').and.returnValue(Observable.of({}));
      spyOn(userService, 'getPhoneInfo').and.returnValue(Observable.of({ phone_method: phoneMethod.chatMessage }));
      spyOn(messageService, 'getMessages').and.returnValue(Observable.of({ data: [] }));
      spyOn(eventService, 'emit');
      let conversation = MOCK_CONVERSATION();

      service.createConversation(MOCK_CONVERSATION().item.id).subscribe();
      service.getSingleConversationMessages(conversation).subscribe(response => conversation = response);
      tick();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.REQUEST_PHONE, phoneMethod.chatMessage);
    }));
  });

});

/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConversationService } from './conversation.service';
import { HttpService } from '../http/http.service';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Conversation } from './conversation';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { ItemService } from '../item/item.service';
import { Item } from '../item/item';
import { XmppService } from '../xmpp/xmpp.service';
import { MessageService } from '../message/message.service';
import { PersistencyService } from '../persistency/persistency.service';
import { Message, messageStatus } from '../message/message';
import { EventService } from '../event/event.service';
import * as _ from 'lodash';
import { NotificationService } from '../notification/notification.service';
import { TrackingService } from '../tracking/tracking.service';
import { ConversationTotals } from './totals.interface';
import { Lead } from './lead';
import {
  CONVERSATION_DATE, CONVERSATION_ID, CONVERSATION_PHONE,
  CONVERSATIONS_DATA, createConversationsArray,
  MOCK_CONVERSATION, MOCK_NOT_FOUND_CONVERSATION, NOT_FOUND_CONVERSATION_ID,
  SECOND_MOCK_CONVERSATION, SURVEY_RESPONSES, MOCKED_CONVERSATIONS
} from '../../../tests/conversation.fixtures.spec';
import { MOCK_USER,
  MockedUserService,
  USER_ID,
  USER_ITEM_DISTANCE,
  OTHE_USER_ID,
  MOCK_OTHER_USER } from '../../../tests/user.fixtures.spec';
import { ITEM_ID, MockedItemService, MOCK_ITEM } from '../../../tests/item.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import {
  createMessagesArray, MESSAGE_MAIN, MESSAGE_MAIN_UPDATED, MOCK_MESSAGE,
  MOCK_RANDOM_MESSAGE,
  MOCK_MESSAGE_FROM_OTHER
} from '../../../tests/message.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { ConnectionService } from '../connection/connection.service';
import { Subscription } from 'rxjs/Subscription';

let service: ConversationService;
let http: HttpService;
let userService: UserService;
let itemService: ItemService;
let messageService: MessageService;
let notificationService: NotificationService;
let xmpp: XmppService;
let persistencyService: PersistencyService;
let eventService: EventService;
let trackingService: TrackingService;
let connectionService: ConnectionService;

const MOCKED_CONVERSATION_DATA: any = CONVERSATIONS_DATA[0];
const EMPTY_RESPONSE: Response = new Response(new ResponseOptions({body: JSON.stringify([])}));
const CONVERSATION_RESPONSE: Response = new Response(new ResponseOptions(
  {body: JSON.stringify(MOCKED_CONVERSATION_DATA)})
);

class MockedXmppService {
  totalUnreadMessages = 42;

  sendConversationStatus(userId: string, conversationId: string) {
  }

  isConnected(): Observable<any> {
    return Observable.of(true);
  }

  isBlocked() {
    return true;
  }

  addUnreadMessagesCounter() {}
}

describe('Service: Conversation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversationService,
        ...TEST_HTTP_PROVIDERS,
        {provide: UserService, useClass: MockedUserService},
        {provide: ItemService, useClass: MockedItemService},
        {provide: XmppService, useClass: MockedXmppService},
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {
          provide: NotificationService, useValue: {
          sendBrowserNotification() {
          }
        }
        },
        {
          provide: ConnectionService, useValue: {}
        },
        MessageService,
        EventService
      ]
    });
    service = TestBed.get(ConversationService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    messageService = TestBed.get(MessageService);
    http = TestBed.get(HttpService);
    xmpp = TestBed.get(XmppService);
    persistencyService = TestBed.get(PersistencyService);
    notificationService = TestBed.get(NotificationService);
    eventService = TestBed.get(EventService);
    trackingService = TestBed.get(TrackingService);
    connectionService = TestBed.get(ConnectionService);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('subscribeConversationRead', () => {
    it('should create the messagesReadSubscription', () => {
      const mockedConversation = MOCK_CONVERSATION();

      service['subscribeConversationRead'](mockedConversation);

      expect(service.messagesReadSubscription).toBeTruthy();
    });

    it('should call markAllAsRead when the MESSAGE_READ event is triggered with a thread that matches the conversation id', () => {
      spyOn(service, 'markAllAsRead');
      const mockedConversation = MOCK_CONVERSATION();

      service['subscribeConversationRead'](mockedConversation);
      eventService.emit(EventService.MESSAGE_READ, mockedConversation.id);

      expect(service.markAllAsRead).toHaveBeenCalledWith(mockedConversation);
    });

    it('should NOT call markAllAsRead when the MESSAGE_READ event is triggered with a thread that DOES NOT matches the conversation id', () => {
      spyOn(service, 'markAllAsRead');
      const mockedConversation = MOCK_CONVERSATION();

      service['subscribeConversationRead'](mockedConversation);
      eventService.emit(EventService.MESSAGE_READ, 'other id');

      expect(service.markAllAsRead).not.toHaveBeenCalled();
    });
  });

  describe('getLeads', () => {
    const TOTAL = 4;
    const QUERY_RESULT: Conversation[] = createConversationsArray(TOTAL);
    const SINCE = 1234567;
    const UNREAD_MESSAGES = 2;
    const TOTAL_MESSAGES = 4;
    let response: Conversation[];
    describe('with results', () => {
      beforeEach(() => {
        spyOn(service, 'query').and.returnValue(Observable.of(_.clone(QUERY_RESULT)));
        spyOn<any>(service, 'loadUnreadMessagesNumber').and.callFake((conversation: Conversation) => {
          conversation.unreadMessages = UNREAD_MESSAGES;
          return Observable.of(conversation);
        });
        spyOn(service, 'loadMessagesIntoConversations').and.callFake((conversations: Conversation[]) => {
          return Observable.of(conversations.map((conversation: Conversation) => {
            conversation.messages = createMessagesArray(TOTAL_MESSAGES);
            return conversation;
          }));
        });
        response = null;
      });
      describe('no archived', () => {
        describe('without parameters', () => {
          beforeEach(() => {
            service.getLeads().subscribe((r: Conversation[]) => {
              response = r;
            });
          });
          it('should return conversations with unreadMessages and messages', () => {
            expect(response.length).toEqual(TOTAL);
            response.forEach((conversation: Conversation) => {
              expect(conversation instanceof Conversation).toBe(true);
              expect(conversation.unreadMessages).toBe(UNREAD_MESSAGES);
              expect(conversation.messages.length).toBe(TOTAL_MESSAGES);
            });
          });
          it('should set conversations', () => {
            expect(service.leads).toEqual(QUERY_RESULT);
          });
          it('should set firstLoad to false', () => {
            expect(service.firstLoad).toBe(false);
          });
          it('should call other functions', () => {
            expect(service['loadUnreadMessagesNumber']).toHaveBeenCalledTimes(TOTAL);
            expect(service['loadMessagesIntoConversations']).toHaveBeenCalled();
          });
        });
        it('should call query with since', () => {
          service.getLeads(SINCE).subscribe();
          expect(service.query).toHaveBeenCalledWith(SINCE, undefined);
        });
        it('should return concatenated convesations', () => {
          const INITIAL_TOTAL = 3;
          service.leads = createConversationsArray(INITIAL_TOTAL);
          service.getLeads(SINCE).subscribe((r: Conversation[]) => {
            response = r;
          });
          expect(service.leads.length).toBe(TOTAL + INITIAL_TOTAL);
          expect(response.length).toBe(TOTAL);
        });
      });
      describe('archived', () => {
        describe('without parameters', () => {
          beforeEach(() => {
            service.getLeads(null, true).subscribe((r: Conversation[]) => {
              response = r;
            });
          });
          it('should return conversations with unreadMessages and messages', () => {
            expect(response.length).toEqual(TOTAL);
            response.forEach((conversation: Conversation) => {
              expect(conversation instanceof Conversation).toBe(true);
              expect(conversation.unreadMessages).toBe(UNREAD_MESSAGES);
              expect(conversation.messages.length).toBe(TOTAL_MESSAGES);
            });
          });
          it('should set conversations', () => {
            expect(service.archivedLeads).toEqual(QUERY_RESULT);
          });
          it('should set firstLoad to false', () => {
            expect(service.firstLoad).toBe(false);
          });
          it('should call other functions', () => {
            expect(service['loadUnreadMessagesNumber']).toHaveBeenCalledTimes(TOTAL);
            expect(service['loadMessagesIntoConversations']).toHaveBeenCalled();
          });
        });
        it('should call query with since', () => {
          service.getLeads(SINCE, true).subscribe();
          expect(service.query).toHaveBeenCalledWith(SINCE, true);
        });
        it('should return concatenated convesations', () => {
          const INITIAL_TOTAL = 3;
          service.archivedLeads = createConversationsArray(INITIAL_TOTAL);
          service.getLeads(SINCE, true).subscribe((r: Conversation[]) => {
            response = r;
          });
          expect(service.archivedLeads.length).toBe(TOTAL + INITIAL_TOTAL);
          expect(response.length).toBe(TOTAL);
        });
      });

    });
    describe('with no results', () => {
      it('should return empty array', () => {
        spyOn(service, 'query').and.returnValue(Observable.of([]));
        service.getLeads(SINCE).subscribe((r: Conversation[]) => {
          response = r;
        });
        expect(response.length).toBe(0);
        expect(service.ended).toBe(true);
      });
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

  describe('checkIfLastPage', () => {
    it('should call endpoint with lastDate', () => {
      const RESPONSE: Response = new Response(new ResponseOptions({body: JSON.stringify(createConversationsArray(2))}));
      spyOn(http, 'get').and.returnValue(Observable.of(RESPONSE));
      spyOn<any>(service, 'getLastDate').and.returnValue(12345);
      service.checkIfLastPage().subscribe();
      expect(http.get).toHaveBeenCalledWith('api/v3/protool/conversations', {
        until: 12345,
        hidden: false
      });
      expect(service.ended).toBe(false);
    });
    it('should set ended true', () => {
      const RESPONSE: Response = new Response(new ResponseOptions({body: JSON.stringify([])}));
      spyOn(http, 'get').and.returnValue(Observable.of(RESPONSE));
      spyOn<any>(service, 'getLastDate').and.returnValue(12345);
      service.checkIfLastPage().subscribe();
      expect(service.ended).toBe(true);
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

  describe('loadUnreadMessagesNumber', () => {
    const UNREAD_MESSAGES = 5;
    const INITIAL_UNREAD_MESSAGES = 3;
    let response: Conversation;
    beforeEach(() => {
      spyOn(persistencyService, 'getUnreadMessages').and.returnValue(Observable.of({unreadMessages: UNREAD_MESSAGES}));
      const conversation: Conversation = MOCK_CONVERSATION();
      messageService.totalUnreadMessages = INITIAL_UNREAD_MESSAGES;
      service['loadUnreadMessagesNumber'](conversation).subscribe((r: Conversation) => {
        response = r;
      });
    });
    it('should return conversation with unreadMessages', () => {
      expect(response instanceof Conversation).toBe(true);
      expect(response.unreadMessages).toBe(UNREAD_MESSAGES);
    });
    it('should update totalUnreadMessages', () => {
      expect(messageService.totalUnreadMessages).toBe(INITIAL_UNREAD_MESSAGES + UNREAD_MESSAGES);
    });
  });

  describe('loadMessagesIntoConversations', () => {
    const TOTAL_MESSAGES = 4;
    const TOTAL_UNREAD_MESSAGES = 4;
    const TOTAL_CONVERSATIONS = 5;
    const CONVERSATIONS: Conversation[] = createConversationsArray(TOTAL_CONVERSATIONS);
    let response: Conversation[];
    describe('conversations with messages', () => {
      beforeEach(() => {
        spyOn<any>(service, 'loadMessages').and.callFake((conversations: Conversation[]) => {
          return Observable.of(conversations.map((conversation: Conversation) => {
            conversation.messages = createMessagesArray(TOTAL_MESSAGES);
            return conversation;
          }));
        });
        spyOn(service, 'loadNotStoredMessages').and.callFake((conversations: Conversation[]) => {
          return Observable.of(conversations.map((conversation: Conversation) => {
            conversation.messages.push(...createMessagesArray(TOTAL_UNREAD_MESSAGES));
            return conversation;
          }));
        });
      });
      describe('firstLoad', () => {
        beforeEach(() => {
          service.firstLoad = true;
          service['loadMessagesIntoConversations'](CONVERSATIONS).subscribe((r: Conversation[]) => {
            response = r;
          });
        });
        it('should return conversations with old messages and new messages', () => {
          expect(response.length).toBe(TOTAL_CONVERSATIONS);
          response.forEach((conversation: Conversation) => {
            expect(conversation instanceof Conversation).toBe(true);
            expect(conversation.messages.length).toBe(TOTAL_MESSAGES + TOTAL_UNREAD_MESSAGES);
          });
        });
        it('should call loadMessages and loadNotStoredMessages', () => {
          expect(service['loadMessages']).toHaveBeenCalled();
          expect(service['loadNotStoredMessages']).toHaveBeenCalled();
        });
      });
      describe('firstLoad false', () => {
        beforeEach(() => {
          service.firstLoad = false;
          service['loadMessagesIntoConversations'](CONVERSATIONS).subscribe((r: Conversation[]) => {
            response = r;
          });
        });
        it('should return conversations with old messages', () => {
          expect(response.length).toBe(TOTAL_CONVERSATIONS);
          response.forEach((conversation: Conversation) => {
            expect(conversation instanceof Conversation).toBe(true);
            expect(conversation.messages.length).toBe(TOTAL_MESSAGES);
          });
        });
        it('should call loadMessages and loadNotStoredMessages', () => {
          expect(service['loadMessages']).toHaveBeenCalled();
          expect(service['loadNotStoredMessages']).not.toHaveBeenCalled();
        });
      });
    });
    describe('conversations with no messages', () => {
      beforeEach(() => {
        spyOn<any>(service, 'loadMessages').and.callFake((conversations: Conversation[]) => {
          return Observable.of(conversations.map((conversation: Conversation) => {
            conversation.messages = createMessagesArray(TOTAL_MESSAGES);
            return conversation;
          }));
        });
        spyOn(service, 'loadNotStoredMessages').and.callFake((conversations: Conversation[]) => {
          return Observable.of(conversations.map((conversation: Conversation) => {
            if (+conversation.id % 2 === 0) {
              conversation.messages.push(...createMessagesArray(TOTAL_UNREAD_MESSAGES));
            } else {
              conversation.messages = [];
            }
            return conversation;
          }));
        });
        response = null;
      });
      it('should filter conversations with no messages', () => {
        service.firstLoad = true;
        service['loadMessagesIntoConversations'](CONVERSATIONS).subscribe((r: Conversation[]) => {
          response = r;
        });
        expect(response.length).toBe(2);
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

  describe('markAllAsRead', () => {
    it('should call addStatusToStoredMessages', () => {
      spyOn<any>(service, 'addStatusToStoredMessages');

      service.markAllAsRead(MOCK_CONVERSATION());

      expect(service['addStatusToStoredMessages']).toHaveBeenCalled();
    });

    it('should update message status to READ for all messages that meet the criteria: status is RECEIVED or SENT AND message if fromSelf', () => {
      spyOn<any>(service, 'sendAck');
      spyOn(persistencyService, 'updateMessageStatus');
      const mockedConversation = MOCK_CONVERSATION();
      mockedConversation.messages = [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE, MOCK_MESSAGE_FROM_OTHER];
      mockedConversation.messages[0].fromSelf = true;
      mockedConversation.messages[1].fromSelf = true;
      mockedConversation.messages[2].fromSelf = false;
      mockedConversation.messages[0].status = messageStatus.RECEIVED;
      mockedConversation.messages[1].status = messageStatus.SENT;

      service.markAllAsRead(mockedConversation);

      expect(service['sendAck']).toHaveBeenCalledTimes(2);
      expect(persistencyService.updateMessageStatus).toHaveBeenCalledTimes(2);
      expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(mockedConversation.messages[0].id, messageStatus.READ);
      expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(mockedConversation.messages[1].id, messageStatus.READ);
      expect(persistencyService.updateMessageStatus).not.toHaveBeenCalledWith(mockedConversation.messages[2], messageStatus.READ);
    });
  });

  describe('addStatusToStoredMessages', () => {
    it('should call localDbVersionUpdate in persistencyService and its callback methood', () => {
      spyOn(persistencyService, 'localDbVersionUpdate');
      const mockedConversation = MOCK_CONVERSATION();
      mockedConversation.messages = [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE, MOCK_MESSAGE_FROM_OTHER];

      service['addStatusToStoredMessages'](mockedConversation, messageStatus.READ);

      expect(persistencyService.localDbVersionUpdate).toHaveBeenCalled();
    });

    it('should call updateMessageStatus in persistencyService when the messages are fromSelf and they do not have a string status', () => {
      spyOn(persistencyService, 'updateMessageStatus');
      const mockedConversation = MOCK_CONVERSATION();
      mockedConversation.messages = [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE, MOCK_MESSAGE_FROM_OTHER];
      mockedConversation.messages[0].status = null;
      mockedConversation.messages[1].status = undefined;
      mockedConversation.messages[0].fromSelf = true;
      mockedConversation.messages[1].fromSelf = true;
      mockedConversation.messages[2].fromSelf = false;
      const mockedFn = () => {
        mockedConversation.messages.filter((message) => {
            return message.fromSelf && typeof message.status !== 'string';
          }).forEach((message) => {
            message.status = messageStatus.READ;
            persistencyService.updateMessageStatus(message.id, messageStatus.READ);
          });
        };
      spyOn(persistencyService, 'localDbVersionUpdate').and.callFake(mockedFn);

      service['addStatusToStoredMessages'](mockedConversation, messageStatus.READ);

      expect(persistencyService.updateMessageStatus).toHaveBeenCalledTimes(2);
      expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(mockedConversation.messages[0].id, messageStatus.READ);
      expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(mockedConversation.messages[1].id, messageStatus.READ);
      expect(persistencyService.updateMessageStatus).not.toHaveBeenCalledWith(mockedConversation.messages[2].id, messageStatus.READ);
    });
  });

  describe('markAs', () => {
    it('should update message status for all messages that meet the criteria: message status is missing, OR message status is NULL or the new status order is greater than the current status order', () => {
      spyOn(persistencyService, 'updateMessageStatus');
      const mockedConversation = MOCK_CONVERSATION();
      mockedConversation.messages = [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE, MOCK_MESSAGE_FROM_OTHER];
      mockedConversation.messages[0].status = messageStatus.SENT;
      mockedConversation.messages[1].status = null;
      mockedConversation.messages[2].status = messageStatus.RECEIVED;

      service.markAs(messageStatus.RECEIVED, mockedConversation.messages[0], mockedConversation);
      service.markAs(messageStatus.RECEIVED, mockedConversation.messages[1], mockedConversation);
      service.markAs(messageStatus.SENT, mockedConversation.messages[2], mockedConversation);

      expect(persistencyService.updateMessageStatus).toHaveBeenCalledTimes(2);
      expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(mockedConversation.messages[0].id, messageStatus.RECEIVED);
      expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(mockedConversation.messages[1].id, messageStatus.RECEIVED);
      expect(persistencyService.updateMessageStatus).not.toHaveBeenCalledWith(mockedConversation.messages[2], messageStatus.SENT);
    });

    it('should call sendAck with the new message status when it is updated', () => {
      spyOn<any>(service, 'sendAck');
      const mockedConversation = MOCK_CONVERSATION();
      mockedConversation.messages = [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE, MOCK_MESSAGE_FROM_OTHER];
      mockedConversation.messages[0].status = messageStatus.PENDING;
      mockedConversation.messages[1].status = messageStatus.SENT;
      mockedConversation.messages[2].status = messageStatus.RECEIVED;

      service.markAs(messageStatus.SENT, mockedConversation.messages[0], mockedConversation);
      service.markAs(messageStatus.RECEIVED, mockedConversation.messages[1], mockedConversation);
      service.markAs(messageStatus.SENT, mockedConversation.messages[2], mockedConversation);

      expect(service['sendAck']).toHaveBeenCalledTimes(2);
      expect(service['sendAck']).toHaveBeenCalledWith(
        mockedConversation.messages[0].id,
        mockedConversation.item.id,
        mockedConversation.user.id,
        mockedConversation.id,
        TrackingService.MESSAGE_SENT_ACK);
      expect(service['sendAck']).toHaveBeenCalledWith(
        mockedConversation.messages[1].id,
        mockedConversation.item.id,
        mockedConversation.user.id,
        mockedConversation.id,
        TrackingService.MESSAGE_RECEIVED);
      expect(service['sendAck']).not.toHaveBeenCalledWith(
        mockedConversation.messages[2].id,
        mockedConversation.item.id,
        mockedConversation.user.id,
        mockedConversation.id,
        TrackingService.MESSAGE_SENT_ACK);
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
      expect(mappedResponse.user.blocked).toBe(true);
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
      spyOn(xmpp, 'sendConversationStatus');
      spyOn(trackingService, 'track');
      conversation = MOCK_CONVERSATION();
    });

    it('should track MESSAGE_READ_ACK for each unread message', () => {
      conversation.messages = [MOCK_MESSAGE, MOCK_MESSAGE, MOCK_RANDOM_MESSAGE, MOCK_MESSAGE];
      conversation.unreadMessages = 2;

      service.sendRead(conversation);
      eventService.emit(EventService.MESSAGE_READ_ACK);

      expect(trackingService.track).toHaveBeenCalledTimes(2);
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MESSAGE_READ_ACK, {
        thread_id: conversation.id,
        message_id: MOCK_MESSAGE.id,
        item_id: conversation.item.id
      });
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MESSAGE_READ_ACK, {
        thread_id: conversation.id,
        message_id: MOCK_RANDOM_MESSAGE.id,
        item_id: conversation.item.id
      });
    });

    it('should call the SendConversationStatus if unreadMessages is > 0', () => {
      conversation.unreadMessages = 2;
      service.sendRead(conversation);
      expect(xmpp.sendConversationStatus).toHaveBeenCalledWith(USER_ID, CONVERSATION_ID);
    });

    it('should set unreadMessages to 0', () => {
      conversation.unreadMessages = 2;
      service.sendRead(conversation);
      expect(conversation.unreadMessages).toBe(0);
    });

    it('should set the pouchDb unreadMessages to 0', () => {
      spyOn(persistencyService, 'saveUnreadMessages');
      conversation.unreadMessages = 2;
      service.sendRead(conversation);
      expect(persistencyService.saveUnreadMessages).toHaveBeenCalledWith(conversation.id, 0);
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

    it('should NOT call the SendConversationStatus if unreadMessages is 0', () => {
      conversation.unreadMessages = 0;
      service.sendRead(conversation);
      expect(xmpp.sendConversationStatus).not.toHaveBeenCalled();
    });

  });

  describe('loadMessages', () => {
    let conversations: Conversation[];
    let convWithMessages: Conversation[];
    describe('with normal data', () => {
      beforeEach(() => {
        spyOn(messageService, 'getMessages').and.callFake(() => {
          return Observable.of({
            data: createMessagesArray(7),
            meta: {
              first: 'abc',
              end: false
            }
          });
        });
        connectionService.isConnected = true;
        xmpp.clientConnected = true;
        conversations = createConversationsArray(5);
      });

      it('should call messageService.getMessages', () => {
        spyOn(xmpp, 'addUnreadMessagesCounter').and.returnValue(conversations);
        convWithMessages = [];

        service['loadMessages'](conversations).subscribe((res: Conversation[]) => {
          convWithMessages = res;
        });

        expect(messageService.getMessages).toHaveBeenCalledTimes(5);
      });

      it('should call xmpp.addUnreadMessagesCounter', () => {
        spyOn(xmpp, 'addUnreadMessagesCounter').and.returnValue(conversations);
        convWithMessages = [];

        service['loadMessages'](conversations).subscribe((res: Conversation[]) => {
          convWithMessages = res;
        });

        expect(xmpp.addUnreadMessagesCounter).toHaveBeenCalled();
      });

      it('should call persistencyService.saveUnreadMessages', () => {
        spyOn(xmpp, 'addUnreadMessagesCounter').and.returnValue(conversations);
        spyOn(persistencyService, 'saveUnreadMessages');
        convWithMessages = [];

        service['loadMessages'](conversations).subscribe((res: Conversation[]) => {
          convWithMessages = res;
        });

        expect(persistencyService.saveUnreadMessages).toHaveBeenCalledTimes(5);
      });

      it('should set messageService.totalUnreadMessages', () => {
        spyOn(xmpp, 'addUnreadMessagesCounter').and.returnValue(conversations);
        spyOnProperty(messageService, 'totalUnreadMessages', 'get').and.callThrough();
        convWithMessages = [];

        service['loadMessages'](conversations).subscribe((res: Conversation[]) => {
          convWithMessages = res;
        });

        expect(messageService.totalUnreadMessages).toBe(42);
      });

      it('should fill conversations with messages', () => {
        convWithMessages.forEach((conversation: Conversation) => {
          expect(conversation.messages.length).toBe(7);
        });
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
    });
    describe('with null conversation data', () => {
      it('should return an observable of null', () => {
        let observableResponse: any;
        connectionService.isConnected = true;

        service['loadMessages'](null).subscribe((r: any) => {
          observableResponse = r;
        });

        expect(observableResponse).toBe(null);
      });
    });
  });

  describe('loadNotStoredMessages', () => {
    let initialConversations: Array<Conversation>;
    const MOCK_UNSAVED_CONVERSATION: Conversation = new Conversation('c', 3, CONVERSATION_DATE, false, MOCK_USER, MOCK_ITEM);
    beforeEach(() => {
      connectionService.isConnected = true;
      initialConversations = [
        new Conversation('a', 1, CONVERSATION_DATE, false, MOCK_USER),
        new Conversation('b', 2, CONVERSATION_DATE, false, MOCK_USER)
      ];
      initialConversations[0].messages = [
        new Message('1', 'a', MESSAGE_MAIN.body, MESSAGE_MAIN.from),
        new Message('2', 'a', MESSAGE_MAIN.body, MESSAGE_MAIN.from)
      ];
      initialConversations[1].messages = [
        new Message('3', 'b', MESSAGE_MAIN.body, MESSAGE_MAIN.from),
        new Message('4', 'b', MESSAGE_MAIN.body, MESSAGE_MAIN.from)
      ];
      spyOn<any>(service, 'handleUnreadMessage').and.callThrough();
    });
    describe('with new messages that belong to an already existing conversation', () => {
      describe('with the found messages NOT being duplicated', () => {
        let observableResponse: any;
        beforeEach(() => {
          spyOn(messageService, 'getNotSavedMessages')
          .and
          .returnValue(Observable.of({
            data: [
              new Message('5', 'a', MESSAGE_MAIN.body, OTHE_USER_ID + '@host'),
            ]
          }));
        });
        it('should return an observable with modified conversations', fakeAsync(() => {
          service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
            observableResponse = data;
          });
          tick();
          expect(observableResponse[0].messages.length).toBe(3);
          expect(observableResponse[1].messages.length).toBe(2);
        }));
        it('should call addUserInfo', fakeAsync(() => {
          const messageWithUser: Message = MOCK_MESSAGE;
          spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);
          service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
            observableResponse = data;
          });
          tick();
          expect(messageService.addUserInfo).toHaveBeenCalledTimes(1);
          expect(_.last(observableResponse[0].messages)).toEqual(messageWithUser);
        }));
        it('should add the messages as unreadMessages', () => {
          service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
            observableResponse = data;
          });
          expect(observableResponse[0].unreadMessages).toBe(1);
        });
      });
      describe('with the found messages being duplicated', () => {
        it('should return an observable with modified conversations', fakeAsync(() => {
          spyOn(messageService, 'getNotSavedMessages')
          .and
          .returnValue(Observable.of({
            data: [
              new Message('1', 'a', MESSAGE_MAIN.body, MESSAGE_MAIN.from),
            ]
          }));
          let observableResponse: any;
          service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
            observableResponse = data;
          });
          tick();
          expect(observableResponse[0].messages.length).toBe(2);
          expect(observableResponse[1].messages.length).toBe(2);
        }));
      });
    });
    describe('with new messages that do not belong to any current conversation', () => {
      let observableResponse: any;
      beforeEach(() => {
        spyOn(service, 'get').and.returnValue(Observable.of(MOCK_UNSAVED_CONVERSATION));
        spyOn(messageService, 'addUserInfo').and.callThrough();
      });
      it('should request the information of the new conversation if it does not exist', fakeAsync(() => {
        spyOn(messageService, 'getNotSavedMessages')
        .and
        .returnValue(Observable.of({
          data: [
            new Message('5', 'c', MESSAGE_MAIN.body, MOCK_MESSAGE_FROM_OTHER.from),
          ]
        }));
        service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
          observableResponse = data;
        });
        tick();
        expect(initialConversations.length).toBe(3);
        expect(messageService.addUserInfo).toHaveBeenCalled();
        expect(initialConversations[0].id).toBe('c');
        expect(initialConversations[0].messages.length).toBe(1);
        expect(initialConversations[0].messages[0].id).toBe('5');
        expect(service['handleUnreadMessage']).toHaveBeenCalled();
      }));
      it('should not handle unread messages if the message is not from self', fakeAsync(() => {
        spyOn(messageService, 'getNotSavedMessages')
        .and
        .returnValue(Observable.of({
          data: [
            new Message('5', 'c', MESSAGE_MAIN.body, MESSAGE_MAIN.from),
          ]
        }));
        service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
          observableResponse = data;
        });
        tick();
        expect(initialConversations.length).toBe(3);
        expect(messageService.addUserInfo).toHaveBeenCalled();
        expect(initialConversations[0].id).toBe('c');
        expect(initialConversations[0].messages.length).toBe(1);
        expect(initialConversations[0].messages[0].id).toBe('5');
        expect(service['handleUnreadMessage']).not.toHaveBeenCalled();
      }));
    });

    describe('with no new messages', () => {
      it('should return an observable with the same conversations', fakeAsync(() => {
        spyOn(messageService, 'getNotSavedMessages')
        .and
        .returnValue(Observable.of({data: []}));
        let observableResponse: any;
        service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
          observableResponse = data;
        });
        tick();
        expect(observableResponse[0]).toEqual(initialConversations[0]);
        expect(observableResponse[1]).toEqual(initialConversations[1]);
        expect(service['handleUnreadMessage']).not.toHaveBeenCalled();
      }));

    });

    describe('with a message fromSelf', () => {
      it('should non update total messages', fakeAsync(() => {
        spyOn(messageService, 'getNotSavedMessages')
        .and
        .returnValue(Observable.of({
          data: [
            new Message('10', 'a', MESSAGE_MAIN.body, USER_ID + '@host'),
          ]
        }));
        let observableResponse: any;
        service.loadNotStoredMessages(initialConversations).subscribe((data: Array<Conversation>) => {
          observableResponse = data;
        });
        tick();
        expect(service['handleUnreadMessage']).not.toHaveBeenCalled();
      }));
    });

    describe('when not connected', () => {
      beforeEach(() => {
        connectionService.isConnected = false;
      });
      it('should return an observable with the same conversations', fakeAsync(() => {
        spyOn(messageService, 'getNotSavedMessages');
        let observableResponse: any;

        service.loadNotStoredMessages(initialConversations).subscribe((data: any) => {
          observableResponse = data;
        });
        tick();

        expect(messageService.getNotSavedMessages).not.toHaveBeenCalled();
        expect(observableResponse).toBe(null);
      }));

    });
  });

  describe('handleUnreadMessage', () => {
    it('should add 1 the unreadMessages to the conversation and save it on the DB', () => {
      const conversation: Conversation = MOCK_CONVERSATION();
      spyOn(persistencyService, 'saveUnreadMessages');
      messageService.totalUnreadMessages = 0;
      (service as any).handleUnreadMessage(conversation);
      expect(conversation.unreadMessages).toBe(1);
      expect(messageService.totalUnreadMessages).toBe(1);
      expect(persistencyService.saveUnreadMessages).toHaveBeenCalledWith(conversation.id, conversation.unreadMessages);
    });
  });

  describe('new message', () => {

    beforeEach(() => {
      service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
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
        expect(service.leads[0].messages[0].conversationId).toEqual(MESSAGE_MAIN.thread);
        expect(service.leads[0].messages[0].message).toEqual(MESSAGE_MAIN.body);
        expect(service.leads[0].messages[0] instanceof Message).toBe(true);
        expect(service.leads[1].messages.length).toEqual(0);
      });

      it('should track MESSAGE_RECEIVED_ACK when a new message is received', () => {
        spyOn(trackingService, 'track');
        const message = new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, MESSAGE_MAIN.body, OTHE_USER_ID, MESSAGE_MAIN_UPDATED.date);
        message.user = MOCK_USER;

        service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
        (service as any).onNewMessage(message, true);
        eventService.emit(EventService.MESSAGE_RECEIVED_ACK);

        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MESSAGE_RECEIVED_ACK, {
          thread_id: MESSAGE_MAIN.thread,
          message_id: MESSAGE_MAIN.id,
          item_id: ITEM_ID
        });
      });

      it('should NOT track MESSAGE_RECEIVED_ACK when the recepit has already been sent', () => {
        spyOn(trackingService, 'track');
        const message = new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, MESSAGE_MAIN.body, OTHE_USER_ID, MESSAGE_MAIN_UPDATED.date);
        message.user = MOCK_USER;
        service['receiptSent'] = true;

        service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
        (service as any).onNewMessage(message, true);
        eventService.emit(EventService.MESSAGE_RECEIVED_ACK);

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
          service.handleNewMessages(new Message(
            'new',
            MESSAGE_MAIN.thread,
            MESSAGE_MAIN.body,
            OTHE_USER_ID + '@host',
            MESSAGE_MAIN.date
          ), false);
          expect(service.leads[0].unreadMessages).toBe(2);
          expect(messageService.totalUnreadMessages).toBe(2);
        });

        it('should not increment unreadMessages and totalUnreadMessages more if user is not fromSelf', () => {
          service.handleNewMessages(MOCK_MESSAGE, false);
          expect(service.leads[0].unreadMessages).toBe(1);
          expect(messageService.totalUnreadMessages).toBe(1);
        });
      });

    });

    it('should wait to call onNewMessage if loading', fakeAsync(() => {
      spyOn<any>(service, 'onNewMessage');
      service.firstLoad = true;
      service.handleNewMessages(MOCK_MESSAGE, false);
      expect(service['onNewMessage']).not.toHaveBeenCalled();
      tick(1000);
      expect(service['onNewMessage']).not.toHaveBeenCalled();
      service.firstLoad = false;
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

    it('should bump the conversation to the top if it is not already on the top', () => {
      expect(service.leads[0].id).toBe(CONVERSATION_ID);
      expect(service.leads[1].id).toBe(SECOND_MOCK_CONVERSATION.id);
      service.handleNewMessages(
        new Message(MESSAGE_MAIN.id, SECOND_MOCK_CONVERSATION.id, MESSAGE_MAIN.body, MESSAGE_MAIN.from, MESSAGE_MAIN.date),
        false);
      expect(service.leads[0].id).toBe(SECOND_MOCK_CONVERSATION.id);
      expect(service.leads[1].id).toBe(CONVERSATION_ID);
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

    describe('conversation NOT present', () => {

      beforeEach(() => {
        spyOn(service, 'get').and.returnValue(Observable.of(MOCK_NOT_FOUND_CONVERSATION));
      });

      it('should request the conversation info, add the message and add to the list', () => {
        service.handleNewMessages(
          new Message(MESSAGE_MAIN.id, NOT_FOUND_CONVERSATION_ID, MESSAGE_MAIN.body, MESSAGE_MAIN.from, MESSAGE_MAIN.date),
          false);
        eventService.emit(EventService.MESSAGE_RECEIVED_ACK);

        const newConversation: Conversation = <Conversation>service.leads[0];

        expect(service.get).toHaveBeenCalledWith(NOT_FOUND_CONVERSATION_ID);
        expect(newConversation.id).toBe(NOT_FOUND_CONVERSATION_ID);
        expect(newConversation.modifiedDate).not.toBe(CONVERSATION_DATE);
        expect(newConversation.messages.length).toBe(1);
        expect(newConversation.messages[0].id).toBe(MESSAGE_MAIN.id);
      });

      it('should call addUserInfo', () => {
        const messageWithUser: Message = MOCK_MESSAGE;
        messageWithUser.user = MOCK_USER;
        spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);
        const newMessage: Message = new Message(
          MESSAGE_MAIN.id,
          NOT_FOUND_CONVERSATION_ID,
          MESSAGE_MAIN.body,
          MESSAGE_MAIN.from,
          MESSAGE_MAIN.date);

        service.handleNewMessages(newMessage, false);
        eventService.emit(EventService.MESSAGE_RECEIVED_ACK);

        expect(messageService.addUserInfo).toHaveBeenCalledTimes(1);
        expect(messageService.addUserInfo).toHaveBeenCalledWith(MOCK_NOT_FOUND_CONVERSATION, newMessage);
        expect(service.leads[0].messages[0]).toEqual(messageWithUser);
      });

    });

    describe('no conversations', () => {
      it('should request the conversation info, add the message and add to the list', () => {
        spyOn(service, 'get').and.returnValue(Observable.of(MOCK_NOT_FOUND_CONVERSATION));
        service.leads = [];
        service.handleNewMessages(
          new Message(MESSAGE_MAIN.id, NOT_FOUND_CONVERSATION_ID, MESSAGE_MAIN.body, MESSAGE_MAIN.from, MESSAGE_MAIN.date),
          false);
        eventService.emit(EventService.MESSAGE_RECEIVED_ACK);

        const newConversation: Conversation = <Conversation>service.leads[0];

        expect(service.get).toHaveBeenCalledWith(NOT_FOUND_CONVERSATION_ID);
        expect(newConversation.id).toBe(NOT_FOUND_CONVERSATION_ID);
        expect(newConversation.modifiedDate).not.toBe(CONVERSATION_DATE);
        expect(newConversation.messages.length).toBe(1);
        expect(newConversation.messages[0].id).toBe(MESSAGE_MAIN.id);
      });
    });
  });

  describe('onNewMessage', () => {
    it('should update the message date if the parameter is set', () => {
      service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
      (service as any).onNewMessage(MOCK_MESSAGE, false);
      (service as any).onNewMessage(
        new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, MESSAGE_MAIN.body, MESSAGE_MAIN.from, MESSAGE_MAIN_UPDATED.date),
        true);
      expect(service.leads[0].messages[0].date).toBe(MESSAGE_MAIN_UPDATED.date);
    });

    it('should not save the message if there is no text, no update date && messageToUpdate', () => {
      service.leads = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
      spyOn<any>(service, 'requestConversationInfo');
      (service as any).onNewMessage(
        new Message(MESSAGE_MAIN.id, MESSAGE_MAIN.thread, null, MESSAGE_MAIN.from, MESSAGE_MAIN_UPDATED.date),
        true);
      expect(service.leads[0].messages.length).toBe(0);
      expect(service['requestConversationInfo']).not.toHaveBeenCalled();
    });

    it('should move conversation from archived to new ones if it was archived', () => {
      service.leads = [];
      service['archivedLeads'] = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
      spyOn(eventService, 'emit');
      service['onNewMessage'](MOCK_MESSAGE, false);
      expect(service.leads.length).toBe(1);
      expect(service.leads[0].messages[0]).toEqual(MOCK_MESSAGE);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONVERSATION_UNARCHIVED);
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

  describe('getItemFromConvId', () => {
    it('should return item', () => {
      service.leads = createConversationsArray(4);
      const item: Item = service.getItemFromConvId('2');
      expect(item instanceof Item).toBe(true);
      expect(item.id).toBe(ITEM_ID);
    });
  });

  describe('addConversation', () => {
    it('should call the sendAck method when a new conversation is added', () => {
      spyOn<any>(service, 'sendAck');
      const mockedConversation = MOCK_CONVERSATION();

      service['addConversation'](mockedConversation, MOCK_MESSAGE);

      expect(service['sendAck']).toHaveBeenCalledWith(
        MOCK_MESSAGE.id,
        mockedConversation.item.id,
        mockedConversation.user.id,
        mockedConversation.id,
        TrackingService.MESSAGE_RECEIVED_ACK
      );
    });

    it('should call the addMessage with the new message', () => {
      const messageWithUser: Message = MOCK_MESSAGE;
      spyOn(service, 'addMessage');
      spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);
      const mockedConversation = MOCK_CONVERSATION();

      service['addConversation'](mockedConversation, MOCK_MESSAGE);

      expect(service.addMessage).toHaveBeenCalledWith(mockedConversation, messageWithUser);
    });

    it('should call subscribeConversationRead with the conversations', () => {
      spyOn<any>(service, 'subscribeConversationRead');
      const mockedConversation = MOCK_CONVERSATION();

      service['addConversation'](mockedConversation, MOCK_MESSAGE);

      expect(service['subscribeConversationRead']).toHaveBeenCalledWith(mockedConversation);
    });

    it('should send browser notification', () => {
      spyOn(notificationService, 'sendBrowserNotification');
      const mockedConversation = MOCK_CONVERSATION();
      const messageWithUser: Message = <Message>{
        ...MOCK_MESSAGE,
        user: MOCK_USER,
        fromSelf: false
      };
      spyOn(messageService, 'addUserInfo').and.returnValue(messageWithUser);

      service['addConversation'](mockedConversation, MOCK_MESSAGE);

      expect(notificationService.sendBrowserNotification).toHaveBeenCalledWith(messageWithUser, ITEM_ID);
    });
  });
});

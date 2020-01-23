import { TestBed } from '@angular/core/testing';
import { InboxService } from './inbox.service';
import { MessageService } from '../message/message.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { of, throwError } from 'rxjs';
import { createInboxConversationsArray, MOCK_INBOX_API_RESPONSE } from '../../../tests/inbox.fixtures.spec';
import { MockMessageService } from '../../../tests/message.fixtures.spec';
import { FEATURE_FLAGS_ENUM, FeatureflagService } from '../user/featureflag.service';
import { EventService } from '../event/event.service';
import { InboxConversation } from '../../chat/model/inbox-conversation';
import { INBOX_ITEM_STATUSES, InboxItemPlaceholder } from '../../chat/model/inbox-item';
import { UserService } from '../user/user.service';
import { MOCK_USER, MockedUserService } from '../../../tests/user.fixtures.spec';
import { InboxUserPlaceholder } from '../../chat/model/inbox-user';
import { InboxConversationService } from './inbox-conversation.service';
import { FeatureFlagServiceMock } from '../../../tests';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpModuleNew } from '../http/http.module.new';
import { RealTimeService } from '../message/real-time.service';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { HttpClient } from '@angular/common/http';

describe('InboxService', () => {

  let service: InboxService;
  let http: HttpClient;
  let realTime: RealTimeService;
  let persistencyService: PersistencyService;
  let messageService: MessageService;
  let conversationService: InboxConversationService;
  let featureflagService: FeatureflagService;
  let eventService: EventService;
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModuleNew,
        HttpClientTestingModule
      ],
      providers: [
        InboxService,
        ...TEST_HTTP_PROVIDERS,
        EventService,
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: UserService, useClass: MockedUserService },
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
        {
          provide: AccessTokenService, useValue: {
            accessToken: 'ACCESS_TOKEN'
          }
        },
        {
          provide: InboxConversationService, useValue: {
            subscribeChatEvents() {
            },
            sendReceiveSignalByConversations(): void {
            }
          }
        },
        {
          provide: RealTimeService, useValue: {
            sendDeliveryReceipt(to: string, id: string, thread: string) {
            }
          }
        }
      ]
    });
    service = TestBed.get(InboxService);
    http = TestBed.get(HttpClient);
    realTime = TestBed.get(RealTimeService);
    persistencyService = TestBed.get(PersistencyService);
    messageService = TestBed.get(MessageService);
    conversationService = TestBed.get(InboxConversationService);
    featureflagService = TestBed.get(FeatureflagService);
    eventService = TestBed.get(EventService);
    userService = TestBed.get(UserService);
    httpTestingController = TestBed.get(HttpTestingController);
    spyOnProperty(userService, 'user').and.returnValue(MOCK_USER);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('init', () => {
    let parsedConversationsResponse;

    beforeEach(() => spyOn(http, 'get').and.returnValue(of(JSON.parse(MOCK_INBOX_API_RESPONSE))));

    it('should set selfId as the of the logged in used', () => {
      service.init();

      expect(service['selfId']).toBe(userService.user.id);
    });

    it('should make an HTTP get request to get the inbox', () => {
      spyOn(service, 'getInbox$').and.returnValue(of([]));

      service.init();

      expect(service.getInbox$).toHaveBeenCalledWith();
    });

    it('should return an array of InboxConversation`s with the correct lastMesage for each', () => {
      const apiResponse = JSON.parse(MOCK_INBOX_API_RESPONSE).conversations;

      service.init();

      service.conversations.map((conversation, index) => {
        expect(conversation instanceof InboxConversation).toBe(true);
        expect(conversation.lastMessage.id).toEqual(apiResponse[index].messages.messages[0].id);
      });
    });

    it('should emit a EventService.INBOX_LOADED after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();
      service['selfId'] = MOCK_USER.id;
      parsedConversationsResponse = service['buildConversations'](JSON.parse(MOCK_INBOX_API_RESPONSE).conversations);

      service.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.INBOX_LOADED, parsedConversationsResponse, 'LOAD_INBOX');
    });

    it('should emit a EventService.CHAT_CAN_PROCESS_RT with TRUE after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();

      service.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    it('should call conversationService.subscribeChatEvents', () => {
      spyOn(conversationService, 'subscribeChatEvents');

      service.init();

      expect(conversationService.subscribeChatEvents).toHaveBeenCalled();
    });
  });

  describe('when the http request throws an error', () => {
    beforeEach(() => {
      spyOn<any>(service, 'getInbox$').and.returnValue(throwError(''));
      spyOn<any>(service, 'getArchivedInbox$').and.returnValue(of([]));
      spyOn(persistencyService, 'getStoredInbox').and.returnValue((createInboxConversationsArray(2)));
      spyOn(persistencyService, 'getArchivedStoredInbox').and.returnValue(createInboxConversationsArray(2));
    });

    it('should set errorRetrievingInbox to true', () => {
      service.init();

      expect(service.errorRetrievingInbox).toBe(true);
    });

    it('should call persistencyService.getStoredInbox', () => {
      service.init();

      expect(persistencyService.getStoredInbox).toHaveBeenCalled();
    });
  });

  describe('process API item status as item flags', () => {
    let modifiedResponse;

    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should set item.reserved TRUE when the API response returns an item with status reserved', () => {
      modifiedResponse.conversations[0].item.status = INBOX_ITEM_STATUSES.reserved;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      service.init();

      expect(service.conversations[0].item.reserved).toBe(true);
    });

    it('should set item.sold TRUE when the API response returns an item with status sold', () => {
      modifiedResponse.conversations[0].item.status = INBOX_ITEM_STATUSES.sold;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      service.init();

      expect(service.conversations[0].item.sold).toBe(true);
    });

    it('should set item.notAvailable TRUE when the API response returns an item with status not_available', () => {
      modifiedResponse.conversations[0].item.status = INBOX_ITEM_STATUSES.notAvailable;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      service.init();

      expect(service.conversations[0].item.notAvailable).toBe(true);
    });
  });

  describe('process API user status', () => {
    let modifiedResponse;
    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    describe('user blocked', () => {

      it('should set user.blocked FALSE when the API response returns blocked FALSE', () => {
        modifiedResponse.conversations[0].with_user.blocked = false;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        service.init();

        expect(service.conversations[0].user.blocked).toBe(false);
      });

      it('should set user.blocked TRUE when the API response returns blocked TRUE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = true;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        service.init();

        expect(service.conversations[0].user.blocked).toBe(true);
      });

      it('should set user.blocked FALSE when the API response returns blocked TRUE AND available FALSE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = false;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        service.init();

        expect(service.conversations[0].user.blocked).toBe(false);
      });
    });

    describe('user available', () => {
      it('should set user.available FALSE when the API response returns available FALSE', () => {
        modifiedResponse.conversations[0].with_user.available = false;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        service.init();

        expect(service.conversations[0].user.available).toBe(false);
      });

      it('should set user.available TRUE when the API response returns blocked TRUE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = true;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        service.init();

        expect(service.conversations[0].user.available).toBe(true);
      });

      it('should set user.available TRUE when the API response returns blocked FALSE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = false;
        modifiedResponse.conversations[0].with_user.available = true;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        service.init();

        expect(service.conversations[0].user.available).toBe(true);
      });
    });
  });

  describe('process API response with missing user OR item', () => {
    let modifiedResponse;
    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should set InboxItemPlaceholder as the item of a InboxConversation, when the API response does not return an item object', () => {
      delete modifiedResponse.conversations[0].item;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      service.init();

      expect(service.conversations[0].item).toEqual(InboxItemPlaceholder);
    });

    it('should set InboxUserPlaceholder as the user of a InboxConversation, when the API response does not return a user object', () => {
      delete modifiedResponse.conversations[0].with_user;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      service.init();

      expect(service.conversations[0].user).toEqual(InboxUserPlaceholder);
    });
  });

  describe('loadMorePages', () => {
    let modifiedResponse;

    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should emit CHAT_CAN_PROCESS_RT with false', () => {
      spyOn(eventService, 'emit').and.callThrough();
      spyOn(http, 'get')
      .and.returnValues(of(modifiedResponse), of(modifiedResponse), of(modifiedResponse));

      service.init();

      service.loadMorePages();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, false);
    });

    it('should GET next inbox', () => {
      const expectedRes = modifiedResponse;
      service['nextPageToken'] = expectedRes.next_from;

      service.getNextPage$().subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}bff/messaging/inbox?page_size=${InboxService.PAGE_SIZE}&from=${expectedRes.next_from}`);

      expect(req.request.method).toEqual('GET');
    });

    it('should not add existing conversations', () => {
      spyOn(http, 'get')
      .and.returnValues(of(modifiedResponse), of(modifiedResponse), of(modifiedResponse));

      service.init();

      service.loadMorePages();

      expect(service.conversations.length).toBe(modifiedResponse.conversations.length);
    });

    it('should add not existing conversations', () => {
      const apiResponse = JSON.parse(JSON.stringify(modifiedResponse));
      apiResponse.conversations.map(conversation => conversation.hash = `${conversation.hash}new`);

      spyOn(http, 'get')
      .and.returnValues(of(modifiedResponse), of(apiResponse), of(apiResponse));

      service.init();

      service.loadMorePages();

      expect(service.conversations.length).toBe(modifiedResponse.conversations.length + apiResponse.conversations.length);
    });
  });

  describe('shouldLoadMorePages', () => {
    let modifiedResponse;

    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should return TRUE if APIResponse has next_from', () => {
      spyOn(http, 'get')
      .and.returnValues(of(modifiedResponse), of(modifiedResponse));

      service.init();

      expect(service.shouldLoadMorePages()).toBe(true);
    });

    it('should return FALSE if APIResponse has not next_from', () => {
      delete modifiedResponse.next_from;
      spyOn(http, 'get').and.returnValues(of(modifiedResponse), of(modifiedResponse));

      service.init();

      expect(service.shouldLoadMorePages()).toBe(false);
    });
  });

  describe('shouldCallEndpoint', () => {
    const messageNo = InboxConversationService.MESSAGES_IN_CONVERSATION;

    it('should GET inbox', () => {
      service.getInbox$().subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}bff/messaging/inbox?page_size=${InboxService.PAGE_SIZE}&max_messages=${messageNo}`);
      expect(req.request.method).toEqual('GET');
    });

    it('should GET archived inbox', () => {
      service.getArchivedInbox$().subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}bff/messaging/archived?page_size=${InboxService.PAGE_SIZE}&max_messages=${messageNo}`);
      expect(req.request.method).toEqual('GET');
    });
  });

});

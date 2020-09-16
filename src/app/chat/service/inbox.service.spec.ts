import { TestBed } from '@angular/core/testing';
import { InboxService } from './inbox.service';
import { MessageService } from './message.service';
import { of, throwError } from 'rxjs';
import { MOCK_INBOX_API_RESPONSE } from '../../../tests/inbox.fixtures.spec';
import { MockMessageService } from '../../../tests/message.fixtures.spec';
import { FeatureflagService } from '../../core/user/featureflag.service';
import { EventService } from '../../core/event/event.service';
import { InboxConversation } from '../model/inbox-conversation';
import { InboxItemStatus, InboxItemPlaceholder } from '../model/inbox-item';
import { UserService } from '../../core/user/user.service';
import { MOCK_USER, MockedUserService } from '../../../tests/user.fixtures.spec';
import { InboxUserPlaceholder } from '../model/inbox-user';
import { InboxConversationService } from './inbox-conversation.service';
import { DeviceDetectorServiceMock, FeatureFlagServiceMock, MockRemoteConsoleService } from '../../../tests';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpModuleNew } from '../../core/http/http.module.new';
import { RealTimeService } from '../../core/message/real-time.service';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../../core/http/access-token.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RemoteConsoleService } from '../../core/remote-console';
import { I18nService } from 'app/core/i18n/i18n.service';

describe('InboxService', () => {

  let inboxService: InboxService;
  let http: HttpClient;
  let realTime: RealTimeService;
  let messageService: MessageService;
  let inboxConversationService: InboxConversationService;
  let featureflagService: FeatureflagService;
  let eventService: EventService;
  let userService: UserService;
  let remoteConsoleService: RemoteConsoleService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModuleNew,
        HttpClientTestingModule
      ],
      providers: [
        InboxService,
        EventService,
        { provide: MessageService, useClass: MockMessageService },
        { provide: UserService, useClass: MockedUserService },
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        {
          provide: AccessTokenService, useValue: {
            accessToken: 'ACCESS_TOKEN'
          }
        },
        { provide: InboxConversationService, useClass: InboxConversationService },
        {
          provide: RealTimeService, useValue: {
            sendDeliveryReceipt(to: string, id: string, thread: string) {
            }
          }
        },
        I18nService
      ]
    });
    inboxService = TestBed.inject(InboxService);
    http = TestBed.inject(HttpClient);
    realTime = TestBed.inject(RealTimeService);
    messageService = TestBed.inject(MessageService);
    inboxConversationService = TestBed.inject(InboxConversationService);
    featureflagService = TestBed.inject(FeatureflagService);
    eventService = TestBed.inject(EventService);
    userService = TestBed.inject(UserService);
    remoteConsoleService = TestBed.inject(RemoteConsoleService);
    httpTestingController = TestBed.inject(HttpTestingController);
    jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_USER);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('init', () => {
    let parsedConversationsResponse;

    beforeEach(() => {
      spyOn(http, 'get').and.returnValue(of(JSON.parse(MOCK_INBOX_API_RESPONSE)));
      spyOn(remoteConsoleService, 'sendConnectionChatTimeout');
    });

    it('should set selfId as the of the logged in used', () => {
      inboxService.init();

      expect(inboxService['selfId']).toBe(userService.user.id);
    });

    it('should make an HTTP get request to get the inbox', () => {
      spyOn(inboxService, 'getInbox$').and.returnValue(of([]));

      inboxService.init();

      expect(inboxService.getInbox$).toHaveBeenCalledWith();
    });

    it('should return an array of InboxConversation`s with the correct lastMesage for each', () => {
      const apiResponse = JSON.parse(MOCK_INBOX_API_RESPONSE).conversations;

      inboxService.init();

      inboxConversationService.conversations.forEach((conversation, index) => {
        expect(conversation instanceof InboxConversation).toBe(true);
        expect(conversation.lastMessage.id).toEqual(apiResponse[index].messages.messages[0].id);
      });
    });

    it('should emit a EventService.INBOX_LOADED after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();
      inboxService['selfId'] = MOCK_USER.id;
      parsedConversationsResponse = inboxService['buildConversations'](JSON.parse(MOCK_INBOX_API_RESPONSE).conversations);

      inboxService.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.INBOX_LOADED, parsedConversationsResponse, 'LOAD_INBOX');
    });

    it('should emit a EventService.CHAT_CAN_PROCESS_RT with TRUE after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();

      inboxService.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    it('should call conversationService.subscribeChatEvents', () => {
      spyOn(inboxConversationService, 'subscribeChatEvents');

      inboxService.init();

      expect(inboxConversationService.subscribeChatEvents).toHaveBeenCalled();
    });

    it('should send metric time to connect to chat', () => {
      inboxService.init();

      expect(remoteConsoleService.sendConnectionChatTimeout).toHaveBeenCalledWith('inbox', true);
    });
  });

  describe('when the http request throws an error', () => {
    beforeEach(() => {
      spyOn<any>(inboxService, 'getInbox$').and.returnValue(throwError(''));
      spyOn<any>(inboxService, 'getArchivedInbox$').and.returnValue(of([]));
      spyOn(remoteConsoleService, 'sendConnectionChatTimeout');
      spyOn(remoteConsoleService, 'sendConnectionChatFailed');
    });

    it('should set errorRetrievingInbox to true', () => {
      inboxService.init();

      expect(inboxService.errorRetrievingInbox).toBe(true);
    });

    it('should return empty list', () => {
      inboxService.init();

      expect(inboxConversationService.conversations).toEqual([]);
    });

    it('should call send metric chat timeout', () => {
      inboxService.init();

      expect(remoteConsoleService.sendConnectionChatTimeout).toHaveBeenCalledWith('inbox', false);
    });

    it('should send metric connection to inbox is failed', () => {
      inboxService.init();

      expect(remoteConsoleService.sendConnectionChatFailed).toHaveBeenCalledWith('inbox');
    });
  });

  describe('process API item status as item flags', () => {
    let modifiedResponse;

    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should set item.reserved TRUE when the API response returns an item with status reserved', () => {
      modifiedResponse.conversations[0].item.status = InboxItemStatus.RESERVED;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      inboxService.init();

      expect(inboxConversationService.conversations[0].item.reserved).toBe(true);
    });

    it('should set item.sold TRUE when the API response returns an item with status sold', () => {
      modifiedResponse.conversations[0].item.status = InboxItemStatus.SOLD;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      inboxService.init();

      expect(inboxConversationService.conversations[0].item.sold).toBe(true);
    });

    it('should set item.notAvailable TRUE when the API response returns an item with status not_available', () => {
      modifiedResponse.conversations[0].item.status = InboxItemStatus.NOT_AVAILABLE;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      inboxService.init();

      expect(inboxConversationService.conversations[0].item.notAvailable).toBe(true);
    });
  });

  describe('process API user status', () => {
    let modifiedResponse;
    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    describe('user blocked', () => {

      it('should set user.blocked FALSE when the API response returns blocked FALSE', () => {
        modifiedResponse.conversations[0].with_user.blocked = false;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        inboxService.init();

        expect(inboxConversationService.conversations[0].user.blocked).toBe(false);
      });

      it('should set user.blocked TRUE when the API response returns blocked TRUE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = true;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        inboxService.init();

        expect(inboxConversationService.conversations[0].user.blocked).toBe(true);
      });

      it('should set user.blocked FALSE when the API response returns blocked TRUE AND available FALSE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = false;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        inboxService.init();

        expect(inboxConversationService.conversations[0].user.blocked).toBe(false);
      });
    });

    describe('user available', () => {
      it('should set user.available FALSE when the API response returns available FALSE', () => {
        modifiedResponse.conversations[0].with_user.available = false;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        inboxService.init();

        expect(inboxConversationService.conversations[0].user.available).toBe(false);
      });

      it('should set user.available TRUE when the API response returns blocked TRUE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = true;
        modifiedResponse.conversations[0].with_user.available = true;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        inboxService.init();

        expect(inboxConversationService.conversations[0].user.available).toBe(true);
      });

      it('should set user.available TRUE when the API response returns blocked FALSE AND available TRUE', () => {
        modifiedResponse.conversations[0].with_user.blocked = false;
        modifiedResponse.conversations[0].with_user.available = true;
        spyOn(http, 'get').and.returnValue(of(modifiedResponse));

        inboxService.init();

        expect(inboxConversationService.conversations[0].user.available).toBe(true);
      });
    });
  });

  describe('process API response with missing user OR item', () => {
    let modifiedResponse;
    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should set InboxItemPlaceholder as the item of a InboxConversation, when the API response does not return an item object', () => {
      delete modifiedResponse.conversations[0].item;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      inboxService.init();

      expect(inboxConversationService.conversations[0].item).toEqual(InboxItemPlaceholder);
    });

    it('should set InboxUserPlaceholder as the user of a InboxConversation, when the API response does not return a user object', () => {
      delete modifiedResponse.conversations[0].with_user;
      spyOn(http, 'get').and.returnValue(of(modifiedResponse));

      inboxService.init();

      expect(inboxConversationService.conversations[0].user).toEqual(InboxUserPlaceholder);
    });
  });

  describe('loadMorePages', () => {
    let modifiedResponse;

    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should emit CHAT_CAN_PROCESS_RT with false', () => {
      spyOn(eventService, 'emit').and.callThrough();
      spyOn(http, 'get')
        .and.returnValues(of(modifiedResponse), of(modifiedResponse), of(modifiedResponse));

      inboxService.init();

      inboxService.loadMorePages();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, false);
    });

    it('should GET next inbox', () => {
      const expectedRes = modifiedResponse;
      inboxService['nextPageToken'] = expectedRes.next_from;

      inboxService.getNextPage$().subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}bff/messaging/inbox?page_size=${InboxService.PAGE_SIZE}&from=${expectedRes.next_from}`);

      expect(req.request.method).toEqual('GET');
    });

    it('should not add existing conversations', () => {
      spyOn(http, 'get')
        .and.returnValues(of(modifiedResponse), of(modifiedResponse), of(modifiedResponse));

      inboxService.init();

      inboxService.loadMorePages();

      expect(inboxConversationService.conversations.length).toBe(modifiedResponse.conversations.length);
    });

    it('should add not existing conversations', () => {
      const apiResponse = JSON.parse(JSON.stringify(modifiedResponse));
      apiResponse.conversations.map(conversation => conversation.hash = `${conversation.hash}new`);

      spyOn(http, 'get')
        .and.returnValues(of(modifiedResponse), of(apiResponse), of(apiResponse));

      inboxService.init();

      inboxService.loadMorePages();

      expect(inboxConversationService.conversations.length).toBe(modifiedResponse.conversations.length + apiResponse.conversations.length);
    });
  });

  describe('shouldLoadMorePages', () => {
    let modifiedResponse;

    beforeEach(() => modifiedResponse = JSON.parse(MOCK_INBOX_API_RESPONSE));

    it('should return TRUE if APIResponse has next_from', () => {
      spyOn(http, 'get')
        .and.returnValues(of(modifiedResponse), of(modifiedResponse));

      inboxService.init();

      expect(inboxService.shouldLoadMorePages()).toBe(true);
    });

    it('should return FALSE if APIResponse has not next_from', () => {
      delete modifiedResponse.next_from;
      spyOn(http, 'get').and.returnValues(of(modifiedResponse), of(modifiedResponse));

      inboxService.init();

      expect(inboxService.shouldLoadMorePages()).toBe(false);
    });
  });

  describe('shouldCallEndpoint', () => {
    const messageNo = InboxConversationService.MESSAGES_IN_CONVERSATION;

    it('should GET inbox', () => {
      inboxService.getInbox$().subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}bff/messaging/inbox?page_size=${InboxService.PAGE_SIZE}&max_messages=${messageNo}`);
      expect(req.request.method).toEqual('GET');
    });

    it('should GET archived inbox', () => {
      inboxService.getArchivedInbox$().subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}bff/messaging/archived?page_size=${InboxService.PAGE_SIZE}&max_messages=${messageNo}`);
      expect(req.request.method).toEqual('GET');
    });
  });

});

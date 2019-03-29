import { TestBed } from '@angular/core/testing';
import { InboxService } from './inbox.service';
import { MessageService } from '../message/message.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { HttpService } from '../http/http.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { Observable } from 'rxjs';
import { MOCK_INBOX_API_RESPONSE, createInboxConversationsArray } from '../../../tests/inbox.fixtures.spec';
import { ResponseOptions, Response } from '@angular/http';
import { MockMessageService } from '../../../tests/message.fixtures.spec';
import { FeatureflagService } from '../user/featureflag.service';
import { EventService } from '../event/event.service';
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
    let parsedConversationsResponse;
    beforeEach(() => {
      spyOn(http, 'get').and.returnValue(Observable.of(res));
      parsedConversationsResponse = service['buildConversations'](JSON.parse(MOCK_INBOX_API_RESPONSE).conversations);
    });

    it('should set selfId as the of the logged in used', () => {
      spyOn(eventService, 'subscribe');

      service.init();

      expect(service['selfId']).toBe(userService.user.id);
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

    it('should emit a EventService.INBOX_LOADED after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();

      service.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.INBOX_LOADED, parsedConversationsResponse);
    });

    it('should emit a EventService.CHAT_CAN_PROCESS_RT with TRUE after getInbox returns', () => {
      spyOn(eventService, 'emit').and.callThrough();

      service.init();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, true);
    });
  });

  describe('when the http request throws an error', () => {
    beforeEach(() => {
      spyOn<any>(service, 'getInbox').and.returnValue(Observable.throw(''));
      spyOn(persistencyService, 'getStoredInbox').and.returnValue(Observable.of(createInboxConversationsArray(2)));
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

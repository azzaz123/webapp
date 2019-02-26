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
  });

});

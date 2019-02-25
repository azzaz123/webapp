import { TestBed } from '@angular/core/testing';
import { InboxService } from './inbox.service';
import { MessageService } from '../message/message.service';
import { InboxConversation } from '../conversation/conversation';
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
import { Message } from '../message/message';

let service: InboxService;
let http: HttpService;
let persistencyService: PersistencyService;
let messageService: MessageService;
let featureflagService: FeatureflagService;

describe('InboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InboxService,
        ...TEST_HTTP_PROVIDERS,
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
  });

  describe('getInboxFeatureFlag', () => {
    it('should call featureflagService.getFlag when called', () => {
      spyOn(featureflagService, 'getFlag');

      service.getInboxFeatureFlag();

      expect(featureflagService.getFlag).toHaveBeenCalledWith('web_inbox_projections');
    });
  });

  describe('getInbox', () => {
    const res: Response = new Response (new ResponseOptions({body: MOCK_INBOX_API_RESPONSE}));
    beforeEach(() => {
      spyOn(http, 'get').and.returnValue(Observable.of(res));
    });

    it('should make an HTTP get request to get the inbox', () => {
      service.getInbox();

      expect(http.get).toHaveBeenCalledWith(service['API_URL']);
    });

    it('should return an array of InboxConversations', () => {
      let response;

      service.getInbox().subscribe(r => response = r);

      response.map(el => {
        expect(el instanceof InboxConversation).toBe(true);
      });
    });

    it('should set the number of unreadMessages in messageService', () => {
      spyOn(messageService, 'totalUnreadMessages');
      let expectedUnreadCount = 0;
      res.json().conversations.filter(c => c.unread_messages).map(c => expectedUnreadCount += + c.unread_messages);

      service.getInbox().subscribe();

      expect(messageService.totalUnreadMessages).toBe(expectedUnreadCount);
    });

    it('should save the messages from each conversation via persistencyService', () => {
      spyOn(persistencyService, 'saveMessages');

      service.getInbox();

      res.json().conversations.map(conv => {
        const messages = [];
        conv.messages.map(msg => messages.push(new Message(msg.id, conv.hash, msg.text, msg.from_user_hash,
          new Date(msg.timestamp), msg.status, msg.payload)));
        expect(persistencyService.saveMessages).toHaveBeenCalledWith(messages);
      });
    });
  });

  it('should call persistencyService.updateInbox when saveInbox is called', () => {
    spyOn(persistencyService, 'updateInbox');
    const response = JSON.parse(MOCK_INBOX_API_RESPONSE);

    service.saveInbox(response.conversations);

    expect(persistencyService.updateInbox).toHaveBeenCalledWith(response.conversations);
  });
});

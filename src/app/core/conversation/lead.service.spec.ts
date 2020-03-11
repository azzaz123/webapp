/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { LeadService } from './lead.service';
import { HttpService } from '../http/http.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { Conversation } from './conversation';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../user/user';
import { Item } from '../item/item';
import { ConversationResponse } from './conversation-response.interface';
import { EventService } from '../event/event.service';
import { Lead } from './lead';
import { MOCK_USER, MockedUserService, USER_ID, USER_ITEM_DISTANCE } from '../../../tests/user.fixtures.spec';
import { ITEM_ID, MockedItemService } from '../../../tests/item.fixtures.spec';
import { CONVERSATIONS_DATA, createConversationsArray } from '../../../tests/conversation.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { ConnectionService } from '../connection/connection.service';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from '../../chat/service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TestRequest } from '@angular/common/http/testing/src/request';

@Injectable()
export class MockService extends LeadService {

  protected API_URL = 'api/v3/conversations';
  protected ARCHIVE_URL = 'api/v2/conversations';

  constructor(httpClient: HttpClient,
              http: HttpService,
              userService: UserService,
              itemService: ItemService,
              event: EventService,
              realTime: RealTimeService) {
    super(httpClient, http, userService, itemService, event, realTime);
  }

  protected getLeads(since?: number, concat?: boolean, archived?: boolean): Observable<Conversation[]> {
    return Observable.of([]);
  }

  protected onArchiveAll() {
  }

  protected onArchive(lead: Lead) {
  }

  protected mapRecordData(data: ConversationResponse): Conversation {
    return new Conversation(
      data.id,
      data.legacy_id,
      data.modified_date,
      data.expected_visit,
      data.user,
      data.item,
      [],
      data.buyer_phone_number,
      data.survey_responses
    );
  }
}

let service: MockService;
let http: HttpService;
let userService: UserService;
let itemService: ItemService;
let eventService: EventService;
let connectionService: ConnectionService;
let httpTestingController: HttpTestingController;

describe('LeadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MockService,
        EventService,
        ...TEST_HTTP_PROVIDERS,
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService },
        { provide: RealTimeService, useValue: {} },
        {
          provide: BlockUserXmppService, useValue: {
            getBlockedUsers() {
              return ['1', '2', '3'];
            }
          }
        },
        {
          provide: ConnectionService, useValue: {}
        }
      ]
    });
    service = TestBed.get(MockService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    eventService = TestBed.get(EventService);
    http = TestBed.get(HttpService);
    connectionService = TestBed.get(ConnectionService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    let response: Conversation[];
    let response2: Conversation[];
    beforeEach(() => {
      response = null;
      response2 = null;
      service.leads = [];
    });
    describe('do NOT cacheAllConversations', () => {
      beforeEach(() => {
        spyOn<any>(service, 'getLeads').and.callFake(() => {
          return Observable.of(CONVERSATIONS);
        });
      });
      describe('not archived', () => {
        it('should call getLeads and return conversations', () => {
          service.init().subscribe((r: Conversation[]) => {
            response = r;
          });
          expect(service['getLeads']).toHaveBeenCalledWith(null, undefined);
          expect(response).toEqual(CONVERSATIONS);
        });
        it('should stream result', () => {
          service.stream$.subscribe((r: Conversation[]) => {
            response = r;
          });
          service.init().subscribe();
          expect(response).toEqual(CONVERSATIONS);
        });
      });
      describe('archived', () => {
        it('should call getLeads and return conversations', () => {
          service.init(true).subscribe((r: Conversation[]) => {
            response = r;
          });
          expect(service['getLeads']).toHaveBeenCalledWith(null, true);
          expect(response).toEqual(CONVERSATIONS);
        });
        it('should stream result', () => {
          service.archivedStream$.subscribe((r: Conversation[]) => {
            response = r;
          });
          service.init(true).subscribe();
          expect(response).toEqual(CONVERSATIONS);
        });
      });
    });
  });

  describe('getLastDate', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    const DATE = 123456;
    CONVERSATIONS[3].modifiedDate = DATE;
    it('should return the last conversation date', () => {
      const response = service['getLastDate'](CONVERSATIONS);
      expect(response).toBe(DATE - 1);
    });
  });

  describe('query', () => {
    describe('with backend errors', () => {
      it('should return an observable of null', () => {
        const UNTIL = 12345;

        service.query(UNTIL).subscribe((response: any) => expect(response).toBe(null));

        const req = httpTestingController.expectOne(
          `${environment.baseUrl}api/v3/conversations?until=${UNTIL}&hidden=${false}`);
        req.error(new ErrorEvent('connection failed'));
      });
    });
    describe('with data', () => {
      beforeEach(() => {
        connectionService.isConnected = true;
      });
      describe('with no params', () => {
        let conversations: Conversation[];
        let baseTime: number;
        beforeEach(() => {
          spyOn(userService, 'get').and.callThrough();
          spyOn(itemService, 'get').and.callThrough();
          baseTime = new Date().getTime();
          spyOn<any>(window, 'Date').and.returnValue({
            getTime: () => {
              return baseTime;
            }
          });
        });
        describe('no archive', () => {
          let req: TestRequest;
          beforeEach(() => {
            service.query().subscribe((response: Conversation[]) => conversations = response);

            req = httpTestingController.expectOne(
              `${environment.baseUrl}api/v3/conversations?until=${baseTime}&hidden=${false}`);
            req.flush(CONVERSATIONS_DATA);
          });
          it('should call the http.get method with hidden false', () => {
            expect(req.request.method).toEqual('GET');
            expect(req.request.params.get('until')).toEqual(baseTime.toString());
            expect(req.request.params.get('hidden')).toEqual('false');
          });
          it('should return a conversations array', () => {
            expect(conversations instanceof Array).toBeTruthy();
            expect(conversations.length).toBe(2);
            expect(conversations[0] instanceof Conversation).toBeTruthy();
            expect(conversations[1] instanceof Conversation).toBeTruthy();
          });
          it('should get and map the User', () => {
            expect(userService.get).toHaveBeenCalledWith(USER_ID);
            expect(userService.get).toHaveBeenCalledTimes(2);
            expect(conversations[0].user instanceof User).toBeTruthy();
            expect(conversations[1].user instanceof User).toBeTruthy();
            expect(conversations[0].user.blocked).toBe(MOCK_USER.blocked);
          });
          it('should get and map the Item', () => {
            expect(itemService.get).toHaveBeenCalledWith(ITEM_ID);
            expect(itemService.get).toHaveBeenCalledTimes(2);
            expect(conversations[0].item instanceof Item).toBeTruthy();
            expect(conversations[1].item instanceof Item).toBeTruthy();
            expect(conversations[0].user.itemDistance).toBe(USER_ITEM_DISTANCE);
          });
          it('should set archived false', () => {
            expect(conversations[0].archived).toBeFalsy();
          });
        });
        describe('archive', () => {
          let req: TestRequest;

          beforeEach(() => {
            service.query(null, true).subscribe((res: Conversation[]) => {
              conversations = res;
            });

            req = httpTestingController.expectOne(
              `${environment.baseUrl}api/v3/conversations?until=${baseTime}&hidden=${true}`);
            req.flush(CONVERSATIONS_DATA);
          });

          it('should call the http.get method with hidden true', () => {
            expect(req.request.method).toEqual('GET');
            expect(req.request.params.get('until')).toEqual(baseTime.toString());
            expect(req.request.params.get('hidden')).toEqual('true');
          });
          it('should set archived true', () => {
            expect(conversations[0].archived).toBeTruthy();
          });
        });
      });
      it('should call the http.get method with the since and hidden param', () => {
        const UNTIL = 12345;
        const ARCHIVED = true;

        service.query(UNTIL, ARCHIVED).subscribe();

        const req = httpTestingController.expectOne(
          `${environment.baseUrl}api/v3/conversations?until=${UNTIL}&hidden=${ARCHIVED}`);

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('until')).toEqual(UNTIL.toString());
        expect(req.request.params.get('hidden')).toEqual(String(ARCHIVED));
      });
    });
  });

  describe('archive', () => {
    let archivedConv: Conversation;
    let response: Conversation;

    beforeEach(() => {
      service.leads = createConversationsArray(5);
      archivedConv = <Conversation>service.leads[2];
      spyOn(eventService, 'emit');
      spyOn<any>(service, 'onArchive');
      response = null;
    });
    describe('conversation found', () => {
      let req: TestRequest;

      beforeEach(() => {
        service.archive(archivedConv.id).subscribe((r: Conversation) => response = r);
        req = httpTestingController.expectOne(
          `${environment.baseUrl}api/v2/conversations/${archivedConv.id}/hide`);
        req.flush({});
      });
      it('return an observable with the put call to the delete conversation endpoint', () => {
        expect(req.request.method).toEqual('PUT');
      });
      it('should remove conversation', () => {
        expect(service.leads).not.toContain(archivedConv);
      });
      it('should move conversation to archived array', () => {
        expect(service.archivedLeads).toContain(archivedConv);
      });
      it('should set conversation as archived', () => {
        expect(archivedConv.archived).toBeTruthy();
      });
      it('should return deleted conversation', () => {
        expect(response).toEqual(archivedConv);
      });
      it('should emit event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.LEAD_ARCHIVED, archivedConv);
      });
      it('should call onArchive', () => {
        expect(service['onArchive']).toHaveBeenCalledWith(archivedConv);
      });
    });
    describe('conversation NOT found', () => {
      let req: TestRequest;

      beforeEach(() => {
        service.archive('10').subscribe((r: Conversation) => response = r);
        req = httpTestingController.expectOne(
          `${environment.baseUrl}api/v2/conversations/${10}/hide`);
        req.flush({});
      });
      it('should NOT remove conversation', () => {
        expect(service.leads.length).toBe(5);
      });
      it('should NOT move conversation to archived array', () => {
        expect(service.archivedLeads.length).toBe(0);
      });
      it('should NOT return deleted conversation', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('unarchive', () => {
    let unarchivedConv: Conversation;
    let response: Conversation;
    beforeEach(() => {
      service.archivedLeads = createConversationsArray(5);
      unarchivedConv = <Conversation>service.archivedLeads[2];
      spyOn(service, 'stream');
      response = null;
    });
    describe('conversation found', () => {
      let req: TestRequest;

      beforeEach(() => {
        service.unarchive(unarchivedConv.id).subscribe((r: Conversation) => response = r);
        req = httpTestingController.expectOne(
          `${environment.baseUrl}api/v2/conversations/${unarchivedConv.id}/unhide`);
        req.flush({});
      });
      it('return an observable with the put call to the delete conversation endpoint', () => {
        expect(req.request.method).toEqual('PUT');
      });
      it('should remove conversation', () => {
        expect(service.archivedLeads).not.toContain(unarchivedConv);
      });
      it('should move conversation to leads array', () => {
        expect(service.leads).toContain(unarchivedConv);
      });
      it('should set conversation as unarchived', () => {
        expect(unarchivedConv.archived).toBeFalsy();
      });
      it('should return deleted conversation', () => {
        expect(response).toEqual(unarchivedConv);
      });
      it('should call stream', () => {
        expect(service.stream).toHaveBeenCalledWith(true);
      });
    });
    describe('conversation NOT found', () => {
      let req: TestRequest;

      beforeEach(() => {
        service.unarchive('10').subscribe((r: Conversation) => response = r);
        req = httpTestingController.expectOne(
          `${environment.baseUrl}api/v2/conversations/${10}/unhide`);
        req.flush({});
      });
      it('should NOT remove conversation', () => {
        expect(service.archivedLeads.length).toBe(5);
      });
      it('should NOT move conversation to leads array', () => {
        expect(service.leads.length).toBe(0);
      });
      it('should NOT return deleted conversation', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('archiveAll', () => {
    let baseTime: number;
    beforeEach(() => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'onArchiveAll');
      baseTime = new Date().getTime();
      spyOn<any>(window, 'Date').and.returnValue({
        getTime: () => {
          return baseTime;
        }
      });
    });
    it('should call http.put with current time', () => {
      service.archiveAll().subscribe();
      expect(http.put).toHaveBeenCalledWith('api/v2/conversations/hide?until=' + baseTime);
    });
    it('should call http.put with passed time', () => {
      service.archiveAll(12345).subscribe();
      expect(http.put).toHaveBeenCalledWith('api/v2/conversations/hide?until=12345');
    });
    it('should call onArchiveAll', () => {
      service.archiveAll().subscribe();
      expect(service['onArchiveAll']).toHaveBeenCalled();
    });
  });

  describe('bulkArchive', () => {
    it('should set archived true to every lead', () => {
      service.archivedLeads = [];
      service['bulkArchive'](createConversationsArray(4));
      expect(service.archivedLeads.length).toBe(4);
      service.archivedLeads.forEach((lead: Conversation) => {
        expect(lead.archived).toBeTruthy();
      });
    });
    it('should return []', () => {
      expect(service['bulkArchive'](createConversationsArray(4))).toEqual([]);
    });
  });

  describe('stream', () => {
    it('should stream leads', () => {
      let response: Conversation[];
      const CONVERSATIONS: Conversation[] = createConversationsArray(4);
      service.leads = CONVERSATIONS;
      service.stream$.subscribe((r: Conversation[]) => {
        response = r;
      });
      service.stream();
      expect(response).toEqual(CONVERSATIONS);
    });
    it('should stream archived leads', () => {
      let response: Conversation[];
      const CONVERSATIONS: Conversation[] = createConversationsArray(4);
      service.archivedLeads = CONVERSATIONS;
      service.archivedStream$.subscribe((r: Conversation[]) => {
        response = r;
      });
      service.stream(true);
      expect(response).toEqual(CONVERSATIONS);
    });
  });

  describe('syncItem', () => {
    it('should replace item in leads and archivedLeads', () => {
      const CONVERSATIONS: Conversation[] = createConversationsArray(4);
      CONVERSATIONS[1].item = new Item('id', 1, '1');
      const ITEM = new Item('id', 1, '1', 'new item');
      service.leads = CONVERSATIONS;
      service.archivedLeads = CONVERSATIONS;

      service.syncItem(ITEM);

      expect(service.leads[1].item).toEqual(ITEM);
      expect(service.archivedLeads[1].item).toEqual(ITEM);
    });
  });
});

import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MockRemoteConsoleService } from '../../../tests';
import { MockAnalyticsService } from '../../../tests/analytics.fixtures.spec';
import { CALLS_DATA, createCallsArray } from '../../../tests/call.fixtures';
import { CONVERSATIONS_DATA, createConversationsArray } from '../../../tests/conversation.fixtures.spec';
import { ITEM_ID, MockedItemService } from '../../../tests/item.fixtures.spec';
import { RealTimeServiceMock } from '../../../tests/real-time.fixtures.spec';
import { MockedUserService, MOCK_USER, USER_ID, USER_ITEM_DISTANCE } from '../../../tests/user.fixtures.spec';
import { AnalyticsService } from '../analytics/analytics.service';
import { ConnectionService } from '../connection/connection.service';
import { EventService } from '../event/event.service';
import { Item } from '../item/item';
import { ItemService } from '../item/item.service';
import { RealTimeService } from '../message/real-time.service';
import { RemoteConsoleService } from '../remote-console';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { XmppService } from '../xmpp/xmpp.service';
import { BlockUserXmppService } from '@private/features/chat/core/block-user/block-user-xmpp.service';
import { Call } from './calls';
import { CallsService } from './calls.service';
import { Conversation } from './conversation';
import { CallTotals } from './totals.interface';

let service: CallsService;
let userService: UserService;
let itemService: ItemService;
let connectionService: ConnectionService;
let eventService: EventService;
let httpTestingController: HttpTestingController;

describe('CallsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CallsService,
        XmppService,
        { provide: RealTimeService, useClass: RealTimeServiceMock },
        BlockUserXmppService,
        EventService,
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        {
          provide: ConnectionService,
          useValue: {},
        },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
      ],
    });
    service = TestBed.inject(CallsService);
    userService = TestBed.inject(UserService);
    itemService = TestBed.inject(ItemService);
    connectionService = TestBed.inject(ConnectionService);
    eventService = TestBed.inject(EventService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
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
          return of(CONVERSATIONS);
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

        const req = httpTestingController.expectOne(`${environment.baseUrl}${service.API_URL}?until=${UNTIL}&hidden=${false}`);
        req.error(new ErrorEvent('connection failed'));
      });
    });
    describe('with data', () => {
      beforeEach(() => {
        connectionService.isConnected = true;
      });
      describe('with no params', () => {
        let conversations: Call[];
        let baseTime: number;
        beforeEach(() => {
          spyOn(userService, 'get').and.callThrough();
          spyOn(itemService, 'get').and.callThrough();
          baseTime = new Date().getTime();
          spyOn<any>(window, 'Date').and.returnValue({
            getTime: () => {
              return baseTime;
            },
          });
        });
        describe('no archive', () => {
          let req: TestRequest;
          beforeEach(() => {
            service.query().subscribe((response: Call[]) => (conversations = response));

            req = httpTestingController.expectOne(`${environment.baseUrl}${service.API_URL}?until=${baseTime}&hidden=${false}`);
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
            expect(conversations[0] instanceof Call).toBeTruthy();
            expect(conversations[1] instanceof Call).toBeTruthy();
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
            service.query(null, true).subscribe((res: Call[]) => {
              conversations = res;
            });

            req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}?until=${baseTime}&hidden=${true}`);
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

        const req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}?until=${UNTIL}&hidden=${ARCHIVED}`);

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('until')).toEqual(UNTIL.toString());
        expect(req.request.params.get('hidden')).toEqual(String(ARCHIVED));
      });
    });
  });

  describe('archiveAll', () => {
    let baseTime: number;

    beforeEach(() => {
      spyOn<any>(service, 'bulkArchive');
      baseTime = new Date().getTime();
      spyOn<any>(window, 'Date').and.returnValue({
        getTime: () => {
          return baseTime;
        },
      });
    });
    it('should call http.put with current time', () => {
      service.archiveAll().subscribe();

      const req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}/hide?until=${baseTime}`);
      req.flush({});
      expect(req.request.method).toEqual('PUT');
    });
    it('should call http.put with passed time', () => {
      const UNTIL = 12345;
      service.archiveAll(UNTIL).subscribe();

      const req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}/hide?until=${UNTIL.toString()}`);
      expect(req.request.method).toEqual('PUT');
      req.flush({});
    });
    it('should call onArchiveAll', () => {
      service.archiveAll().subscribe();
      const req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}/hide?until=${baseTime}`);
      req.flush({});
      expect(service['bulkArchive']).toHaveBeenCalled();
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

  describe('getLeads', () => {
    const TOTAL = 4;
    const EXISTNG_TOTAL = 2;
    const SINCE = 1234567;
    const QUERY_RESULT: Call[] = createCallsArray(TOTAL);
    let result: Call[];

    describe('with results', () => {
      beforeEach(() => {
        spyOn(service, 'query').and.returnValue(of(QUERY_RESULT));
        result = null;
      });

      describe('no archive', () => {
        describe('with different conversations', () => {
          beforeEach(() => {
            service.leads = createCallsArray(EXISTNG_TOTAL, undefined, TOTAL);
            service['getLeads'](SINCE, false).subscribe((r: Call[]) => {
              result = r;
            });
          });

          it('should call query', () => {
            expect(service.query).toHaveBeenCalledWith(SINCE, false);
          });

          it('should return the query result', () => {
            expect(result).toEqual(QUERY_RESULT);
          });

          it('should concats calls', () => {
            expect(service.leads.length).toBe(EXISTNG_TOTAL + TOTAL);
          });
        });

        describe('with same conversations', () => {
          it('should not concatenate a conversation with the same id', () => {
            service.leads = createCallsArray(TOTAL);
            service['getLeads'](SINCE, false).subscribe((r: Call[]) => {
              result = r;
            });

            expect(service.leads.length).toBe(TOTAL);
          });

          it('should add the conversations that are not already added', () => {
            service.leads = createCallsArray(EXISTNG_TOTAL);
            service['getLeads'](SINCE, false).subscribe((r: Call[]) => {
              result = r;
            });

            expect(service.leads.length).toBe(TOTAL);
          });
        });
      });

      describe('archive', () => {
        beforeEach(() => {
          service.archivedLeads = createCallsArray(EXISTNG_TOTAL);
          service['getLeads'](SINCE, true).subscribe((r: Call[]) => {
            result = r;
          });
        });

        it('should call query', () => {
          expect(service.query).toHaveBeenCalledWith(SINCE, true);
        });

        it('should return the query result', () => {
          expect(result).toEqual(QUERY_RESULT);
        });

        it('should concats calls', () => {
          expect(service.archivedLeads.length).toBe(EXISTNG_TOTAL + TOTAL);
        });
      });
    });

    describe('with no results', () => {
      beforeEach(() => {
        spyOn(service, 'query').and.returnValue(of([]));
        result = null;
        service.archivedLeads = createCallsArray(EXISTNG_TOTAL);
        service.leads = createCallsArray(EXISTNG_TOTAL);
        service['getLeads'](SINCE).subscribe((r: Call[]) => {
          result = r;
        });
      });

      it('should return an empty array', () => {
        expect(result).toEqual([]);
      });

      it('should not change leads', () => {
        expect(service.leads.length).toBe(EXISTNG_TOTAL);
        expect(service.archivedLeads.length).toBe(EXISTNG_TOTAL);
      });
    });
  });

  describe('getPage', () => {
    let result: Call[];
    const TOTAL_PHONES = 4;
    const TOTAL_CALLS = 3;
    const MIXED_CONVERSATIONS: Conversation[] = [...createConversationsArray(6), ...createConversationsArray(TOTAL_PHONES, true)];

    describe('filter', () => {
      it('should filter by status', () => {
        service.getPage(1, false, 'SHARED').subscribe((r: Call[]) => {
          result = r;
        });
        const WITH_SHARED_STATUS = 3;
        const MIXED_CALLS: any[] = [...createCallsArray(6), ...createConversationsArray(WITH_SHARED_STATUS)];

        service.stream$.next(MIXED_CALLS);

        expect(result.length).toBe(WITH_SHARED_STATUS);
      });

      it('should filter by multiple status', () => {
        service.getPage(1, false, 'ANSWERED,MISSED').subscribe((r: Call[]) => {
          result = r;
        });
        const WITH_ANSWERED_STATUS = 3;
        const WITH_MISSED_STATUS = 4;
        const MIXED_CALLS: any[] = [
          ...createConversationsArray(6),
          ...createCallsArray(WITH_ANSWERED_STATUS, 'ANSWERED'),
          ...createCallsArray(WITH_MISSED_STATUS, 'MISSED'),
        ];

        service.stream$.next(MIXED_CALLS);

        expect(result.length).toBe(WITH_ANSWERED_STATUS + WITH_MISSED_STATUS);
      });
    });

    describe('page size', () => {
      it('should paginate with custom page size and return first page', () => {
        service.getPage(1, false, null, 2).subscribe((r: Call[]) => {
          result = r;
        });

        service.stream$.next(createCallsArray(5));

        expect(result.length).toBe(2);
      });

      it('should paginate with custom page size and return first + second page', () => {
        service.getPage(2, false, null, 2).subscribe((r: Call[]) => {
          result = r;
        });

        service.stream$.next(createCallsArray(5));

        expect(result.length).toBe(4);
      });
    });

    describe('archive', () => {
      describe('with conversations with phone and calls', () => {
        it('should return conversations with phone converted to calls and concat with calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });

          service.archivedStream$.next(createCallsArray(TOTAL_CALLS));

          expect(result.length).toBe(TOTAL_CALLS);
        });
      });

      describe('with conversations with phone and no calls', () => {
        it('should return conversations with phone converted to calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });

          service.archivedStream$.next([]);

          expect(result.length).toBe(0);
        });
      });

      describe('with conversations with no phones and some calls', () => {
        it('should return calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });

          service.archivedStream$.next(createCallsArray(TOTAL_CALLS));

          expect(result.length).toBe(TOTAL_CALLS);
        });
      });

      describe('with no conversations and some calls', () => {
        it('should return calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });

          service.archivedStream$.next(createCallsArray(TOTAL_CALLS));

          expect(result.length).toBe(TOTAL_CALLS);
        });
      });
    });
  });

  describe('mapRecordData', () => {
    it('should return a Call object', () => {
      const response: Call = service['mapRecordData'](CALLS_DATA[0]);

      expect(response instanceof Call).toBeTruthy();
    });
  });

  describe('getTotals', () => {
    it('should return calls total', () => {
      let result: any;
      service.getTotals().subscribe((r: CallTotals) => {
        result = r;
      });

      service.stream$.next(createCallsArray(5));
      service.archivedStream$.next(createCallsArray(4));

      expect(result.calls).toBe(5);
      expect(result.archived).toBe(4);
    });
  });

  describe('archive', () => {
    let archivedCall: Call;
    let response: Call;

    beforeEach(() => {
      service.leads = createCallsArray(5);
      archivedCall = <Call>service.leads[2];
      spyOn(eventService, 'emit');
      response = null;
    });
    describe('conversation found', () => {
      let req: TestRequest;

      beforeEach(() => {
        service.archive(archivedCall.id).subscribe((r: Call) => (response = r));
        req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}/${archivedCall.id}/hide`);
        req.flush({});
      });
      it('return an observable with the put call to the delete conversation endpoint', () => {
        expect(req.request.method).toEqual('PUT');
      });
      it('should remove conversation', () => {
        expect(service.leads).not.toContain(archivedCall);
      });
      it('should move conversation to archived array', () => {
        expect(service.archivedLeads).toContain(archivedCall);
      });
      it('should set conversation as archived', () => {
        expect(archivedCall.archived).toBeTruthy();
      });
      it('should return deleted conversation', () => {
        expect(response).toEqual(archivedCall);
      });
      it('should emit event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.LEAD_ARCHIVED, archivedCall);
      });
    });
    describe('conversation NOT found', () => {
      let req: TestRequest;

      beforeEach(() => {
        service.archive('10').subscribe((r: Call) => (response = r));
        req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}/${10}/hide`);
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
    let unarchivedConv: Call;
    let response: Call;
    beforeEach(() => {
      service.archivedLeads = createCallsArray(5);
      unarchivedConv = <Call>service.archivedLeads[2];
      spyOn(service, 'stream');
      response = null;
    });
    describe('conversation found', () => {
      let req: TestRequest;

      beforeEach(() => {
        service.unarchive(unarchivedConv.id).subscribe((r: Call) => (response = r));
        req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}/${unarchivedConv.id}/unhide`);
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
        service.unarchive('10').subscribe((r: Call) => (response = r));
        req = httpTestingController.expectOne(`${environment.baseUrl}${service.ARCHIVE_URL}/${10}/unhide`);
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
});

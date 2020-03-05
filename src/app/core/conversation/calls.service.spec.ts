/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { CallsService } from './calls.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { XmppService } from '../xmpp/xmpp.service';
import { EventService } from '../event/event.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { MockedUserService } from '../../../tests/user.fixtures.spec';
import { MockedItemService } from '../../../tests/item.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';
import { Call } from './calls';
import { CALLS_DATA, createCallsArray } from '../../../tests/call.fixtures';
import { Observable } from 'rxjs';
import { Conversation } from './conversation';
import { createConversationsArray } from '../../../tests/conversation.fixtures.spec';
import { CallTotals } from './totals.interface';
import { ConnectionService } from '../connection/connection.service';
import { BlockUserXmppService } from './block-user';
import { RealTimeService } from '../message/real-time.service';
import { RemoteConsoleService } from '../remote-console';
import { MockRemoteConsoleService } from '../../../tests';

let service: CallsService;
let userService: UserService;
let itemService: ItemService;
let connectionService: ConnectionService;

describe('CallsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CallsService,
        XmppService,
        RealTimeService,
        BlockUserXmppService,
        EventService,
        ...TEST_HTTP_PROVIDERS,
        {provide: UserService, useClass: MockedUserService},
        {provide: ItemService, useClass: MockedItemService},
        {provide: RemoteConsoleService, useClass: MockRemoteConsoleService},
        {provide: TrackingService, useValue: {}},
        {
          provide: ConnectionService, useValue: {}
        }
      ]
    });
    service = TestBed.get(CallsService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    connectionService = TestBed.get(ConnectionService);
  });

  describe('getLeads', () => {
    const TOTAL = 4;
    const EXISTNG_TOTAL = 2;
    const SINCE = 1234567;
    const QUERY_RESULT: Call[] = createCallsArray(TOTAL);
    let result: Call[];

    describe('with results', () => {
      beforeEach(() => {
        spyOn(service, 'query').and.returnValue(Observable.of(QUERY_RESULT));
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
        spyOn(service, 'query').and.returnValue(Observable.of([]));
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
          ...createCallsArray(WITH_MISSED_STATUS, 'MISSED')
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
});

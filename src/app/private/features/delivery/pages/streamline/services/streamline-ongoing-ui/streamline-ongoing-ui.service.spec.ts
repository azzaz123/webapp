import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS } from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { MOCK_PENDING_TRANSACTIONS_AND_REQUESTS } from '@api/fixtures/core/model/delivery/pending-transactions-and-requests.fixtures.spec';
import { PendingTransactionsAndRequests } from '@api/core/model/delivery';
import { RequestsAndTransactionsPendingService } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.service';
import { StreamlineOngoingUIService } from '@private/features/delivery/pages/streamline/services/streamline-ongoing-ui/streamline-ongoing-ui.service';

import { Observable, ReplaySubject, throwError } from 'rxjs';

describe('StreamlineOngoingUIService', () => {
  let service: StreamlineOngoingUIService;
  let requestsAndTransactionsPendingService: RequestsAndTransactionsPendingService;

  const requestsReplaySubject: ReplaySubject<PendingTransactionsAndRequests> = new ReplaySubject<PendingTransactionsAndRequests>(1);

  class MockRequestsAndTransactionsPendingService {
    get pendingTransactionsAndRequests(): Observable<PendingTransactionsAndRequests> {
      return requestsReplaySubject.asObservable();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StreamlineOngoingUIService,
        { provide: RequestsAndTransactionsPendingService, useClass: MockRequestsAndTransactionsPendingService },
      ],
    });
    service = TestBed.inject(StreamlineOngoingUIService);
    requestsAndTransactionsPendingService = TestBed.inject(RequestsAndTransactionsPendingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting elements', () => {
    beforeEach(() => {
      service.getItems();
    });

    it('should notify loading state', () => {
      let loadingResult: boolean;

      service.loading$.subscribe((data) => (loadingResult = data));

      expect(loadingResult).toBe(true);
    });

    describe('and when server responses', () => {
      beforeEach(() => {
        requestsReplaySubject.next(MOCK_PENDING_TRANSACTIONS_AND_REQUESTS);
      });

      it('should notify loading state ended', () => {
        let loadingResult: boolean;

        service.loading$.subscribe((data) => (loadingResult = data));

        expect(loadingResult).toBe(false);
      });

      it('should notify current elements list', () => {
        let historicList: HistoricList;

        service.historicList$.subscribe((data) => (historicList = data));

        expect(JSON.stringify(historicList)).toEqual(JSON.stringify(MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS));
      });
    });
  });

  describe('when reseting state', () => {
    beforeEach(() => {
      service.reset();
    });

    it('should go back to initial state', () => {
      let result: HistoricList;

      service.historicList$.subscribe((data) => (result = data));

      expect(result).toBeFalsy();
    });
  });
});

describe('WHEN there is an error retrieving the shipping list', () => {
  let streamlineOngoingUIService: StreamlineOngoingUIService;
  let requestsAndTransactionsPendingService: RequestsAndTransactionsPendingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StreamlineOngoingUIService,
        {
          provide: RequestsAndTransactionsPendingService,
          useValue: {
            get pendingTransactionsAndRequests() {
              return throwError('The server is broken');
            },
          },
        },
      ],
    });
    streamlineOngoingUIService = TestBed.inject(StreamlineOngoingUIService);
    requestsAndTransactionsPendingService = TestBed.inject(RequestsAndTransactionsPendingService);
  });

  it('should show the generic error catcher', fakeAsync(() => {
    expect(() => {
      streamlineOngoingUIService.getItems();
      tick();
    }).toThrowError();
  }));
});

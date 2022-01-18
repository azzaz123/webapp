import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { HistoricTransaction } from '@api/core/model';
import { MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS } from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { MOCK_HISTORIC_TRANSACTIONS } from '@api/fixtures/core/model/delivery/transaction/historic-transaction.fixtures.spec';
import { StreamlineCompletedUIService } from '@private/features/delivery/pages/streamline/services/streamline-completed-ui/streamline-completed-ui.service';
import { TransactionsHistoryApiService } from '@api/delivery/transactions/history/transactions-history-api.service';

import { ReplaySubject, throwError } from 'rxjs';

describe('StreamlineCompletedUIService', () => {
  let service: StreamlineCompletedUIService;
  const requestsReplaySubject: ReplaySubject<HistoricTransaction[]> = new ReplaySubject<HistoricTransaction[]>(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StreamlineCompletedUIService,
        { provide: TransactionsHistoryApiService, useValue: { get: () => requestsReplaySubject.asObservable() } },
      ],
    });
    service = TestBed.inject(StreamlineCompletedUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify there are more items', () => {
    expect(service.infiniteScrollDisabled).toBe(false);
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
        requestsReplaySubject.next(MOCK_HISTORIC_TRANSACTIONS);
      });

      it('should notify loading state ended', () => {
        let loadingResult: boolean;

        service.loading$.subscribe((data) => (loadingResult = data));

        expect(loadingResult).toBe(false);
      });

      it('should notify current elements list', () => {
        let historicList: HistoricList;

        service.historicList$.subscribe((data) => (historicList = data));

        expect(JSON.stringify(historicList)).toEqual(JSON.stringify(MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS));
      });

      describe('and when server notifies no more items', () => {
        beforeEach(() => {
          service.reset();
          requestsReplaySubject.next([]);
          service.getItems();
        });

        it('should notify no more items', () => {
          expect(service.infiniteScrollDisabled).toBe(true);
        });
      });
    });
  });

  describe('when reseting state', () => {
    beforeEach(() => {
      service.reset();
    });

    it('should reset transactions', () => {
      let result: HistoricList;

      service.historicList$.subscribe((data) => (result = data));

      expect(result).toBeFalsy();
    });

    it('should enable infinite scrolling', () => {
      expect(service.infiniteScrollDisabled).toBe(false);
    });
  });
});

describe('WHEN there is an error retrieving the shipping list', () => {
  let streamlineCompletedUIService: StreamlineCompletedUIService;
  let transactionsHistoryApiService: TransactionsHistoryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StreamlineCompletedUIService,
        {
          provide: TransactionsHistoryApiService,
          useValue: {
            get() {
              return throwError('The server is broken');
            },
          },
        },
      ],
    });
    streamlineCompletedUIService = TestBed.inject(StreamlineCompletedUIService);
    transactionsHistoryApiService = TestBed.inject(TransactionsHistoryApiService);
  });

  it('should show the generic error catcher', fakeAsync(() => {
    expect(() => {
      streamlineCompletedUIService.getItems();
      tick();
    }).toThrowError();
  }));
});

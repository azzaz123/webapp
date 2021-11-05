import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RequestAndTransactionsPendingModule } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.module';
import { RequestsAndTransactionsPendingService } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.service';
import { PendingTransaction } from '@api/core/model';
import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/pending-transactions-fixtures.spec';
import { MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS } from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { ReplaySubject } from 'rxjs';

import { StreamlineOngoingUIService } from './streamline-ongoing-ui.service';

describe('StreamlineOngoingUIService', () => {
  let service: StreamlineOngoingUIService;
  let requestsAndTransactionsPendingService: RequestsAndTransactionsPendingService;

  const requestsReplaySubject: ReplaySubject<PendingTransaction[]> = new ReplaySubject<PendingTransaction[]>(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RequestAndTransactionsPendingModule],
      providers: [StreamlineOngoingUIService],
    });
    service = TestBed.inject(StreamlineOngoingUIService);
    requestsAndTransactionsPendingService = TestBed.inject(RequestsAndTransactionsPendingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting elements', () => {
    beforeEach(() => {
      jest
        .spyOn(requestsAndTransactionsPendingService, 'pendingTransactions$', 'get')
        .mockReturnValue(requestsReplaySubject.asObservable());
      service.getItems();
    });

    it('should notify loading state', () => {
      let loadingResult: boolean;

      service.loading$.subscribe((data) => (loadingResult = data));

      expect(loadingResult).toBe(true);
    });

    describe('and when server responses', () => {
      beforeEach(() => {
        requestsReplaySubject.next(MOCK_PENDING_TRANSACTIONS);
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

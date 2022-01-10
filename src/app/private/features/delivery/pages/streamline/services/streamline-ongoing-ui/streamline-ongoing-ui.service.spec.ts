import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS } from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { DeliveryPendingTransactionsAndRequests } from '@api/core/model/delivery';
import { StreamlineOngoingUIService } from '@private/features/delivery/pages/streamline/services/streamline-ongoing-ui/streamline-ongoing-ui.service';

import { Observable, ReplaySubject, throwError } from 'rxjs';
import { DeliveriesOngoingService } from '@api/bff/delivery/deliveries/ongoing/deliveries-ongoing.service';
import { MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_BUYER } from '@api/fixtures/core/model/delivery/deliveries/ongoing/delivery-pending-transactions-and-requests.fixtures.spec';

describe('StreamlineOngoingUIService', () => {
  let service: StreamlineOngoingUIService;
  let deliveriesOngoingService: DeliveriesOngoingService;
  let spyPendingTransactionsAndRequestsAsSeller;
  let spyPendingTransactionsAndRequestsAsBuyer;

  const requestsAsSellerReplaySubject: ReplaySubject<DeliveryPendingTransactionsAndRequests> =
    new ReplaySubject<DeliveryPendingTransactionsAndRequests>(1);
  const requestsAsBuyerReplaySubject: ReplaySubject<DeliveryPendingTransactionsAndRequests> =
    new ReplaySubject<DeliveryPendingTransactionsAndRequests>(1);

  class MockDeliveriesOngoingService {
    get pendingTransactionsAndRequestsAsSeller(): Observable<DeliveryPendingTransactionsAndRequests> {
      return requestsAsSellerReplaySubject.asObservable();
    }
    get pendingTransactionsAndRequestsAsBuyer(): Observable<DeliveryPendingTransactionsAndRequests> {
      return requestsAsBuyerReplaySubject.asObservable();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StreamlineOngoingUIService, { provide: DeliveriesOngoingService, useClass: MockDeliveriesOngoingService }],
    });
    service = TestBed.inject(StreamlineOngoingUIService);
    deliveriesOngoingService = TestBed.inject(DeliveriesOngoingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting items', () => {
    beforeEach(() => {
      spyPendingTransactionsAndRequestsAsSeller = jest.spyOn(deliveriesOngoingService, 'pendingTransactionsAndRequestsAsSeller', 'get');
      spyPendingTransactionsAndRequestsAsBuyer = jest.spyOn(deliveriesOngoingService, 'pendingTransactionsAndRequestsAsBuyer', 'get');
    });

    describe('and we are the seller', () => {
      beforeEach(() => {
        service.getItems(true);
      });

      it('should request the transactions and requests as seller', () => {
        expect(spyPendingTransactionsAndRequestsAsSeller).toHaveBeenCalledTimes(1);
      });

      it('should NOT request the transactions and requests as buyer', () => {
        expect(spyPendingTransactionsAndRequestsAsBuyer).not.toHaveBeenCalled();
      });
    });

    describe('and we are the buyer', () => {
      beforeEach(() => {
        service.getItems(false);
      });

      it('should request the transactions and requests as buyer', () => {
        expect(spyPendingTransactionsAndRequestsAsBuyer).toHaveBeenCalledTimes(1);
      });

      it('should NOT request the transactions and requests as seller', () => {
        expect(spyPendingTransactionsAndRequestsAsSeller).not.toHaveBeenCalled();
      });
    });
  });

  describe('when getting elements', () => {
    beforeEach(() => {
      service.getItems(true);
    });

    it('should notify loading state', () => {
      let loadingResult: boolean;

      service.loading$.subscribe((data) => (loadingResult = data));

      expect(loadingResult).toBe(true);
    });

    describe('and when server responses', () => {
      beforeEach(() => {
        requestsAsSellerReplaySubject.next(MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_BUYER);
      });

      it('should notify loading state ended', () => {
        let loadingResult: boolean;

        service.loading$.subscribe((data) => (loadingResult = data));

        expect(loadingResult).toBe(false);
      });

      it('should notify current elements list', () => {
        let historicList: HistoricList;

        service.historicList$.subscribe((data) => (historicList = data));

        expect(historicList).toEqual(MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS);
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StreamlineOngoingUIService,
        {
          provide: DeliveriesOngoingService,
          useValue: {
            get pendingTransactionsAndRequestsAsSeller() {
              return throwError('The server is broken');
            },
          },
        },
      ],
    });
    streamlineOngoingUIService = TestBed.inject(StreamlineOngoingUIService);
  });

  it('should show the generic error catcher', fakeAsync(() => {
    expect(() => {
      streamlineOngoingUIService.getItems(true);
      tick();
    }).toThrowError();
  }));
});

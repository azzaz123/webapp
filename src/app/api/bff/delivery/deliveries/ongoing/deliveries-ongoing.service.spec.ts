import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { DeliveryPendingTransactionsAndRequests } from '@api/core/model/delivery';
import { MOCK_DELIVERIES_ONGOING_AS_BUYER_DTO_RESPONSE } from '@api/fixtures/bff/delivery/deliveries/ongoing/deliveries-ongoing-as-buyer.fixtures.spec';
import { MOCK_DELIVERIES_ONGOING_AS_SELLER_DTO_RESPONSE } from '@api/fixtures/bff/delivery/deliveries/ongoing/deliveries-ongoing-as-seller.fixtures.spec';
import {
  MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_BUYER,
  MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER,
} from '@api/fixtures/core/model/delivery/deliveries/ongoing/delivery-pending-transactions-and-requests.fixtures.spec';
import { Observable, of } from 'rxjs';

import { DeliveriesOngoingService } from './deliveries-ongoing.service';
import { DeliveriesOngoingAsBuyerDto, DeliveriesOngoingAsSellerDto } from './dtos';
import { DeliveriesOngoingHttpService } from './http/deliveries-ongoing-http.service';

describe('DeliveriesOngoingService', () => {
  let service: DeliveriesOngoingService;
  let deliveriesOngoingHttpService: DeliveriesOngoingHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveriesOngoingService,
        {
          provide: DeliveriesOngoingHttpService,
          useValue: {
            getAsBuyer(): Observable<DeliveriesOngoingAsBuyerDto> {
              return of(MOCK_DELIVERIES_ONGOING_AS_BUYER_DTO_RESPONSE);
            },
            getAsSeller(): Observable<DeliveriesOngoingAsSellerDto> {
              return of(MOCK_DELIVERIES_ONGOING_AS_SELLER_DTO_RESPONSE);
            },
          },
        },
      ],
    });
    deliveriesOngoingHttpService = TestBed.inject(DeliveriesOngoingHttpService);
    service = TestBed.inject(DeliveriesOngoingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN they ask for the pending transactions and requests as buyer', () => {
    beforeEach(() => {
      spyOn(deliveriesOngoingHttpService, 'getAsBuyer').and.returnValue(of(MOCK_DELIVERIES_ONGOING_AS_BUYER_DTO_RESPONSE));
    });

    it('should call to the transactions http service', () => {
      service.pendingTransactionsAndRequestsAsBuyer.subscribe();

      expect(deliveriesOngoingHttpService.getAsBuyer).toBeCalledTimes(1);
    });

    it('should receive the transactions and requests mapped', fakeAsync(() => {
      const expected = MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_BUYER;
      let response: DeliveryPendingTransactionsAndRequests;

      service.pendingTransactionsAndRequestsAsBuyer.subscribe((data: DeliveryPendingTransactionsAndRequests) => {
        response = data;

        expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
      });

      flush();
    }));
  });

  describe('WHEN they ask for the pending transactions and requests as seller', () => {
    beforeEach(() => {
      spyOn(deliveriesOngoingHttpService, 'getAsSeller').and.returnValue(of(MOCK_DELIVERIES_ONGOING_AS_SELLER_DTO_RESPONSE));
    });

    it('should call to the transactions http service', () => {
      service.pendingTransactionsAndRequestsAsSeller.subscribe();

      expect(deliveriesOngoingHttpService.getAsSeller).toBeCalledTimes(1);
    });

    it('should receive the transactions and requests mapped', fakeAsync(() => {
      const expected = MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER;
      let response: DeliveryPendingTransactionsAndRequests;

      service.pendingTransactionsAndRequestsAsSeller.subscribe((data: DeliveryPendingTransactionsAndRequests) => {
        response = data;

        expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
      });

      flush();
    }));
  });
});

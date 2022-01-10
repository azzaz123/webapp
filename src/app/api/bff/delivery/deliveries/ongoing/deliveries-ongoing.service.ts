import { Injectable } from '@angular/core';
import { DeliveryPendingTransactionsAndRequests } from '@api/core/model/delivery';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DeliveriesOngoingAsBuyerDto, DeliveriesOngoingAsSellerDto } from './dtos';
import { DeliveriesOngoingHttpService } from './http/deliveries-ongoing-http.service';
import {
  mapDeliveriesAsBuyerToPendingTransactionsAndRequests,
  mapDeliveriesAsSellerToPendingTransactionsAndRequests,
} from './mappers/deliveries-to-pending-transactions-and-requests.mapper';

@Injectable()
export class DeliveriesOngoingService {
  constructor(private deliveriesOngoingHttpService: DeliveriesOngoingHttpService) {}

  public get pendingTransactionsAndRequestsAsBuyer(): Observable<DeliveryPendingTransactionsAndRequests> {
    return this.deliveriesOngoingHttpService.getAsBuyer().pipe(
      take(1),
      map((dtoResponse: DeliveriesOngoingAsBuyerDto) => mapDeliveriesAsBuyerToPendingTransactionsAndRequests(dtoResponse))
    );
  }

  public get pendingTransactionsAndRequestsAsSeller(): Observable<DeliveryPendingTransactionsAndRequests> {
    return this.deliveriesOngoingHttpService.getAsSeller().pipe(
      take(1),
      map((dtoResponse: DeliveriesOngoingAsSellerDto) => mapDeliveriesAsSellerToPendingTransactionsAndRequests(dtoResponse))
    );
  }
}

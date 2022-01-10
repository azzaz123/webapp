import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DELIVERY_ONGOING_AS_BUYER_ENDPOINT, DELIVERY_ONGOING_AS_SELLER_ENDPOINT } from './endpoints';
import { DeliveriesOngoingAsBuyerDto, DeliveriesOngoingAsSellerDto } from './../dtos';

@Injectable()
export class DeliveriesOngoingHttpService {
  constructor(private http: HttpClient) {}

  public getAsBuyer(): Observable<DeliveriesOngoingAsBuyerDto> {
    return this.http.get<DeliveriesOngoingAsBuyerDto>(DELIVERY_ONGOING_AS_BUYER_ENDPOINT);
  }

  public getAsSeller(): Observable<DeliveriesOngoingAsSellerDto> {
    return this.http.get<DeliveriesOngoingAsSellerDto>(DELIVERY_ONGOING_AS_SELLER_ENDPOINT);
  }
}

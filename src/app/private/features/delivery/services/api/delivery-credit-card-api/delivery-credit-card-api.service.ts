import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UuidService } from '@core/uuid/uuid.service';
import { environment } from '@environments/environment';
import { DeliveryCreditCardApi } from '@private/features/delivery/interfaces/delivery-credit-card/api/delivery-credit-card-api.interface';
import { Observable } from 'rxjs';
export const DELIVERY_CREDIT_CARDS_ENDPOINT = `${environment.baseUrl}/api/v3/payments/cards`;

@Injectable()
export class DeliveryCreditCardApiService {
  constructor(private http: HttpClient, private uuidService: UuidService) {}

  public get(): Observable<DeliveryCreditCardApi> {
    return this.http.get<DeliveryCreditCardApi>(DELIVERY_CREDIT_CARDS_ENDPOINT);
  }

  public delete(): Observable<null> {
    return this.http.delete<null>(DELIVERY_CREDIT_CARDS_ENDPOINT);
  }
}

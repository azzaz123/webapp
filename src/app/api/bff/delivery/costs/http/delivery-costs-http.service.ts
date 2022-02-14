import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DELIVERY_COSTS_ENDPOINT } from '@api/bff/delivery/costs/http/endpoints';
import { DeliveryCostsDto } from '@api/bff/delivery/costs/dtos';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryCostsHttpService {
  constructor(private http: HttpClient) {}

  public getCosts(itemId: string): Observable<DeliveryCostsDto> {
    return this.http.get<DeliveryCostsDto>(DELIVERY_COSTS_ENDPOINT(itemId));
  }
}

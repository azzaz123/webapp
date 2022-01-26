import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DELIVERY_COSTS_ENDPOINT } from '@api/bff/delivery/costs/http/endpoints';
import { DeliveryCostsItemDto } from '@api/bff/delivery/costs/dtos';

import { Observable } from 'rxjs';

@Injectable()
export class DeliveryCostsHttpService {
  constructor(private http: HttpClient) {}

  public getCosts(itemId: string): Observable<DeliveryCostsItemDto> {
    return this.http.get<DeliveryCostsItemDto>(DELIVERY_COSTS_ENDPOINT(itemId));
  }
}

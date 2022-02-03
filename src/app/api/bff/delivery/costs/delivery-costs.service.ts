import { Injectable } from '@angular/core';

import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { DeliveryCostsHttpService } from '@api/bff/delivery/costs/http/delivery-costs-http.service';
import { mapDeliveryCostsDtoToDeliveryCosts } from '@api/bff/delivery/costs/mappers/delivery-costs.mapper';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DeliveryCostsService {
  constructor(private deliveryCostsHttpService: DeliveryCostsHttpService) {}

  public getCosts(itemId: string): Observable<DeliveryCosts> {
    return this.deliveryCostsHttpService.getCosts(itemId).pipe(map(mapDeliveryCostsDtoToDeliveryCosts));
  }
}

import { Injectable } from '@angular/core';

import { DeliveryCostsItem } from '@api/bff/delivery/costs/interfaces/delivery-costs-item.interface';
import { DeliveryCostsHttpService } from '@api/bff/delivery/costs/http/delivery-costs-http.service';
import { mapDeliveryCostsItemDtoToDeliveryCostsItem } from '@api/bff/delivery/costs/mappers/delivery-costs.mapper';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DeliveryCostsService {
  constructor(private deliveryCostsHttpService: DeliveryCostsHttpService) {}

  public getCosts(itemId: string): Observable<DeliveryCostsItem> {
    return this.deliveryCostsHttpService.getCosts(itemId).pipe(map(mapDeliveryCostsItemDtoToDeliveryCostsItem));
  }
}

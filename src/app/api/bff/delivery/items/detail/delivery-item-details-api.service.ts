import { Injectable } from '@angular/core';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryItemDetailsHttpService } from './http/delivery-item-details-http.service';
import { mapDeliveryItemDetailsDtoToDeliveryItemDetails } from './mappers/responses/delivery-item-details.mapper';

@Injectable()
export class DeliveryItemDetailsApiService {
  constructor(private deliveryItemDetailsHttpService: DeliveryItemDetailsHttpService) {}

  public getDeliveryDetailsByItemHash(itemHash: string): Observable<DeliveryItemDetails | null> {
    return this.deliveryItemDetailsHttpService.get(itemHash).pipe(map(mapDeliveryItemDetailsDtoToDeliveryItemDetails));
  }
}

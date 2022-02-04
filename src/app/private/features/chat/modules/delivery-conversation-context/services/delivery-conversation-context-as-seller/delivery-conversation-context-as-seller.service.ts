import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';

@Injectable()
export class DeliveryConversationContextAsSellerService {
  // TODO
  public getBannerPropertiesAsSeller(itemHash: string): Observable<DeliveryBanner | null> {
    return of(null);
  }
}

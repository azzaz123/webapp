import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeliveryAddressApiService } from '../api/delivery-address-api/delivery-address-api.service';

@Injectable({
  providedIn: 'root',
})
export class DeliveryAddressService {
  private deliveryAddress: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private deliveryAddressApiService: DeliveryAddressApiService) {}

  public get(cache = true): Observable<any> {
    if (cache && this.deliveryAddress) {
      return this.deliveryAddress.asObservable();
    }

    return this.deliveryAddressApiService.get().pipe(
      tap((address: any) => {
        this.deliveryAddress.next(address);
      })
    );
  }

  public update(newDeliveryAddress: any): Observable<any> {
    return this.deliveryAddressApiService.update(newDeliveryAddress);
  }
}

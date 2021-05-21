import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeliveryAddressError } from '@private/features/delivery/errors/delivery-address/delivery-address-error';
import { DeliveryAddressErrorApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DeliveryAddressApi } from '../../../interfaces/delivery-address/delivery-address-api.interface';
import { DeliveryAddressApiService } from '../../api/delivery-address-api/delivery-address-api.service';
import { DeliveryAddressStoreService } from '../delivery-address-store/delivery-address-store.service';

@Injectable()
export class DeliveryAddressService {
  constructor(
    private deliveryAddressApiService: DeliveryAddressApiService,
    private deliveryAddressStoreService: DeliveryAddressStoreService
  ) {}

  public get(cache = true): Observable<DeliveryAddressApi> {
    if (cache && this.deliveryAddressStoreService.deliveryAddress) {
      return this.deliveryAddressStoreService.deliveryAddress$;
    }

    return this.deliveryAddressApiService.get().pipe(
      tap((address: DeliveryAddressApi) => {
        this.updateDeliveryAddressStore(address);
      })
    );
  }

  public updateOrCreate(newDeliveryAddress: DeliveryAddressApi, isNewAddress: boolean): Observable<null> {
    const observable = isNewAddress
      ? this.deliveryAddressApiService.create(newDeliveryAddress)
      : this.deliveryAddressApiService.update(newDeliveryAddress);

    return observable.pipe(
      tap(() => {
        this.updateDeliveryAddressStore(newDeliveryAddress);
      }),
      catchError((e: HttpErrorResponse) => {
        const errors: DeliveryAddressErrorApi[] = e?.error;
        const mappedErrors: DeliveryAddressError[] = errors?.map((err) => new DeliveryAddressError(err.error_code, e.status, err.message));

        return throwError(mappedErrors);
      })
    );
  }

  private updateDeliveryAddressStore(newDeliveryAddress: DeliveryAddressApi): void {
    this.deliveryAddressStoreService.deliveryAddress = { ...newDeliveryAddress };
  }
}

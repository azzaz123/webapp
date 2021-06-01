import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DELIVERY_ADDRESS_ERROR } from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';
import {
  DeliveryAddressError,
  INVALID_DELIVERY_ADDRESS_POSTAL_CODE,
} from '@private/features/delivery/errors/delivery-address/delivery-address-error';

@Injectable()
export class DeliveryLocationsService {
  constructor(private deliveryLocationsApiService: DeliveryLocationsApiService) {}

  public getLocationsByPostalCodeAndCountry(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsApiService.getByPostalCodeAndCountry(postalCode, countryISOCode).pipe(
      catchError((e: HttpErrorResponse) => {
        const mappedErrors: DeliveryAddressError[] = e?.error?.map((err) => {
          const errorCode =
            e.status === INVALID_DELIVERY_ADDRESS_POSTAL_CODE ? DELIVERY_ADDRESS_ERROR['invalid postal code'] : err.error_code;
          return new DeliveryAddressError(errorCode, e.status, err.message);
        });
        return throwError(mappedErrors);
      })
    );
  }
}

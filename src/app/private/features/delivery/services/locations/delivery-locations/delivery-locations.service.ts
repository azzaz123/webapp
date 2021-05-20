import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DeliveryAddressErrorApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';
import { DeliveryAddressError } from '@private/features/delivery/errors/delivery-address/delivery-address-error';

@Injectable()
export class DeliveryLocationsService {
  constructor(private deliveryLocationsApiService: DeliveryLocationsApiService) {}

  public getLocationsByPostalCodeAndCountry(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsApiService.getByPostalCodeAndCountry(postalCode, countryISOCode).pipe(
      catchError((e: HttpErrorResponse) => {
        const errors: DeliveryAddressErrorApi[] = e?.error;
        const mappedErrors: DeliveryAddressError[] = errors?.map((err) => new DeliveryAddressError(err.error_code, e.status, err.message));
        return throwError(mappedErrors);
      })
    );
  }
}

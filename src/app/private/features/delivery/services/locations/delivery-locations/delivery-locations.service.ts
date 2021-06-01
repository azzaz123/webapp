import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { catchError } from 'rxjs/operators';
import { DeliveryPostalCodesErrorMapper } from '@private/features/delivery/errors/mappers/postal-codes/delivery-postal-codes-error-mapper';
import { DeliveryErrorApi } from '@private/features/delivery/errors/classes/delivery-api.error';
import { DeliveryPostalCodesError } from '@private/features/delivery/errors/classes/postal-codes/delivery-postal-codes.error';
@Injectable()
export class DeliveryLocationsService {
  private errorMapper: DeliveryPostalCodesErrorMapper = new DeliveryPostalCodesErrorMapper();

  constructor(private deliveryLocationsApiService: DeliveryLocationsApiService) {}

  public getLocationsByPostalCodeAndCountry(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsApiService
      .getByPostalCodeAndCountry(postalCode, countryISOCode)
      .pipe(catchError((networkError: DeliveryErrorApi<DeliveryPostalCodesError>) => this.errorMapper.map(networkError)));
  }
}

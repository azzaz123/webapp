import { InjectionToken } from '@angular/core';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Observable } from 'rxjs';
import { UserLocation } from './user-location';

export const USER_LOCATION_REPOSITORY_TOKEN: InjectionToken<UserLocationRepository> = new InjectionToken<
  UserLocationRepository
>('USER_LOCATION_REPOSITORY');

export interface UserLocationRepository {
  updateByCoordinates(coordinate: Coordinate): Observable<UserLocation>;
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { UserLocation } from '../../../domain';
import { UserLocationRepository } from '../../../domain/location/user-location.repository';

@Injectable()
export class ApiUserLocationRepository implements UserLocationRepository {

  static USER_LOCATION_URL = `${environment.baseUrl}location`;

  constructor(private http: HttpClient) {}

  updateByCoordinates({latitude, longitude}: Coordinate): Observable<UserLocation> {
    const body: Pick<Coordinate, 'latitude' | 'longitude'> = {latitude, longitude};
    return this.http.put<UserLocation>(ApiUserLocationRepository.USER_LOCATION_URL, body);
  }

}

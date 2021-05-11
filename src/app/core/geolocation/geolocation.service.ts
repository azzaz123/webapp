import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ItemPlace } from './geolocation-response.interface';
import { Coordinate } from './address-response.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

export const MAPS_PLACES_API = 'maps/places';
export const MAPS_PLACE_API = 'maps/here/place';
export const MAPS_PROVIDER = 'here';
export const MAPS_REVERSE_GEOCODE = 'maps/here/reverseGeocode';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  public search(query: string): Observable<ItemPlace[]> {
    const params: any = {
      query,
      provider: MAPS_PROVIDER,
    };

    return this.http.get<ItemPlace[]>(`${environment.siteUrl}${MAPS_PLACES_API}`, { params });
  }

  public geocode(placeId: string): Observable<Coordinate> {
    const params: any = { placeId };

    return this.http
      .get<Coordinate>(`${environment.siteUrl}${MAPS_PLACE_API}`, { params })
      .pipe(
        map((res) => {
          return {
            ...res,
            name: placeId,
          };
        })
      );
  }

  public reverseGeocode(latitude: string, longitude: string): Observable<string> {
    const params = new HttpParams({
      fromObject: { latitude, longitude },
    });
    return this.http
      .get<{ label: string }>(`${environment.siteUrl}${MAPS_REVERSE_GEOCODE}`, {
        params,
      })
      .pipe(
        map((res) => {
          return res.label;
        })
      );
  }
}

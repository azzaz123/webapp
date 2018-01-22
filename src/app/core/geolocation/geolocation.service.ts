import { Injectable } from '@angular/core';
import { HttpService } from 'shield';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { GeolocationResponse } from './geolocation-response.interface';
import { Coordinate } from './address-response.interface';

@Injectable()
export class GeolocationService {

  private apiKey: string = 'AIzaSyCwbqhPH-_1Zyh9hAYi6GDwiyk1we41DZ4';

  constructor(private http: HttpService) { }

  public search(query: string): Observable<GeolocationResponse[]> {
    let params: any =  {
      query: query,
      provider: 'here'
    };
    return this.http.getNoBase(environment.siteUrl + 'maps/places', params)
      .map(res => res.json());
  }

  public geocode(placeId: string): Observable<Coordinate> {
    let params: any =  {
      placeId: placeId,
    };
    return this.http.getNoBase(environment.siteUrl + '/maps/here/place', params)
      .map(res => res.json())
      .map((res: any) => {
        return {
          ...res,
          name: placeId
        }
      });
  }

}

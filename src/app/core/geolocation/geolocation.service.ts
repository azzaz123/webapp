import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GeolocationResponse } from './geolocation-response.interface';
import { Coordinate } from './address-response.interface';
import { HttpService } from '../http/http.service';

@Injectable()
export class GeolocationService {

  private apiKey = 'AIzaSyCwbqhPH-_1Zyh9hAYi6GDwiyk1we41DZ4';

  constructor(private http: HttpService) { }

  public search(query: string): Observable<GeolocationResponse[]> {
    const params: any =  {
      query: query,
      provider: 'here'
    };
    return this.http.getNoBase(environment.siteUrl + 'maps/places', params)
      .map(res => res.json());

    // TODO:
    // const params: IDictionary[] = [
    //   {
    //     key: 'query',
    //     value: query
    //   },
    //   {
    //     key: 'provider',
    //     value: 'here'
    //   }
    // ];

    // return this.httpNew.getNoBase(environment.siteUrl + 'maps/places', params);
  }

  public geocode(placeId: string): Observable<Coordinate> {
    const params: any =  {
      placeId: placeId,
    };
    return this.http.getNoBase(environment.siteUrl + 'maps/here/place', params)
      .map(res => res.json())
      .map((res: any) => {
        return {
          ...res,
          name: placeId
        };
      });

    // TODO:
    // const params: IDictionary[] = [
    //   {
    //     key: 'placeId',
    //     value: placeId
    //   }
    // ];

    // return this.httpNew.getNoBase(environment.siteUrl + 'maps/here/place', params)
    // .map(res => res.json())
    //   .map((res: any) => {
    //     return {
    //       ...res,
    //       name: placeId
    //     };
    //   });
  }

}

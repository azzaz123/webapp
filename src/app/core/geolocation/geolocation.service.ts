import { Injectable } from '@angular/core';
import { HttpService } from "shield";
import { Observable } from "rxjs/Observable";

@Injectable()
export class GeolocationService {

  private API_URL_V1: string = '';
  private apiKey: string = 'AIzaSyCwbqhPH-_1Zyh9hAYi6GDwiyk1we41DZ4';

  constructor(private http: HttpService) { }

  public search(query: string): Observable<any> {
    let params: any =  {
      query: query,
      apiKey: this.apiKey
    };
    return this.http.get(this.API_URL_V1 + 'maps/places', params)
      .map(res => res.json());
  }

  public geocode(placeId: any): Observable<any> {
    let params: any =  {
      placeId: placeId,
      apiKey: this.apiKey
    };
    return this.http.get(this.API_URL_V1 + 'maps/place', params)
      .map(res => res.json());
  }

}

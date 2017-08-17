import { Injectable } from '@angular/core';
import { HttpService } from "shield";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";

@Injectable()
export class GeolocationService {

  private apiKey: string = 'AIzaSyCwbqhPH-_1Zyh9hAYi6GDwiyk1we41DZ4';

  constructor(private http: HttpService) { }

  public search(query: string): Observable<any> {
    let params: any =  {
      query: query,
      apiKey: this.apiKey
    };
    return this.http.getNoBase(environment.siteUrl + 'maps/places', params)
      .map(res => res.json());
  }

  public geocode(placeId: string): Observable<any> {
    let params: any =  {
      placeId: placeId,
      apiKey: this.apiKey
    };
    return this.http.getNoBase(environment.siteUrl + 'maps/place', params)
      .map(res => res.json());
  }

}

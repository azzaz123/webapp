import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.beta';
import { Observable } from 'rxjs';

export const GET_FAVOURITES = `${environment.baseUrl}api/v3/delivery/addresses/main`;

@Injectable()
export class DeliveryAddressApiService {
  constructor(private http: HttpClient) {}

  public getDeliveryAddress(): Observable<any> {
    return this.http.get<any>(GET_FAVOURITES);
  }
}

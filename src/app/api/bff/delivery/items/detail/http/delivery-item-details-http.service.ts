import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_VERSION } from '@environments/version';
import { Observable } from 'rxjs';
import { DeliveryItemDetailsDto } from '../dtos/delivery-item-detail-dto.interface';
import { DELIVERY_ITEM_DETAILS_ENDPOINT } from './endpoints';

@Injectable()
export class DeliveryItemDetailsHttpService {
  constructor(private http: HttpClient) {}

  public get(itemHash: string): Observable<DeliveryItemDetailsDto> {
    const headers: HttpHeaders = this.getAppVersionHeader();
    return this.http.get<DeliveryItemDetailsDto>(DELIVERY_ITEM_DETAILS_ENDPOINT(itemHash), { headers });
  }

  private getAppVersionHeader(): HttpHeaders {
    return new HttpHeaders({ 'X-AppVersion': APP_VERSION.replace(/\./g, '') });
  }
}

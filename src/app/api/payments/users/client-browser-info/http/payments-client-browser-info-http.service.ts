import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
import { Observable } from 'rxjs';
import { PaymentsClientBrowserInfoDto } from '../dtos/requests';
import { mapPaymentsClientBrowserInfoToDto } from '../mappers/requests/payments-client-browser-info.mapper';
import { PAYMENTS_CLIENT_BROWSER_INFO_ENDPOINT } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class PaymentsClientBrowserInfoHttpService {
  constructor(private http: HttpClient) {}

  public put(info: PaymentsClientBrowserInfo): Observable<void> {
    const body: PaymentsClientBrowserInfoDto = mapPaymentsClientBrowserInfoToDto(info);
    return this.http.put<void>(PAYMENTS_CLIENT_BROWSER_INFO_ENDPOINT, body);
  }
}

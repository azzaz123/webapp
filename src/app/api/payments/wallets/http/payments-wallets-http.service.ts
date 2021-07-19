import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentsWalletsApi } from '../dtos/responses';
import { PAYMENTS_WALLETS_ENDPOINT } from './endpoints';

@Injectable()
export class PaymentsWalletsHttpService {
  constructor(private http: HttpClient) {}

  public get(): Observable<PaymentsWalletsApi> {
    return this.http.get<PaymentsWalletsApi>(PAYMENTS_WALLETS_ENDPOINT);
  }
}

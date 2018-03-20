import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FinancialCard, SabadellInfoResponse } from './payment.interface';
import { HttpService } from '../http/http.service';

@Injectable()
export class PaymentService {

  private API_URL: string = 'api/v3/payments';

  constructor(private http: HttpService) {
  }

  public getFinancialCard(): Observable<FinancialCard> {
    return this.http.get(this.API_URL + '/c2b/financial-card')
    .map((r: Response) => r.json());
  }

  public getSabadellInfo(orderId: string): Observable<SabadellInfoResponse> {
    return this.http.get(this.API_URL + '/c2b/sabadell/tpv/params', {
      orderId: orderId
    })
    .map((r: Response) => r.json());
  }

  public pay(orderId: string): Observable<any> {
    return this.http.post(this.API_URL + '/c2b/sabadell/tpv/pay', {
      order_id: orderId
    });
  }

}

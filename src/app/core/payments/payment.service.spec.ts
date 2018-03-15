import { fakeAsync, TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';

import { PaymentService } from './payment.service';
import { Observable } from 'rxjs/Observable';
import { FinancialCard, SabadellInfoResponse } from './payment.interface';
import { FINANCIAL_CARD, SABADELL_RESPONSE } from '../../../tests/payments.fixtures.spec';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';

describe('PaymentService', () => {

  let service: PaymentService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        PaymentService
      ]
    });
    service = TestBed.get(PaymentService);
    http = TestBed.get(HttpService);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  describe('pay', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.callThrough();
      service.pay('1').subscribe();
      expect(http.post).toHaveBeenCalledWith('api/v3/payments/c2b/sabadell/tpv/pay', {
        order_id: '1'
      });
    });
  });

  describe('getFinancialCard', () => {
    let response: FinancialCard;
    it('should call endpoint', () => {
      let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(FINANCIAL_CARD)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getFinancialCard().subscribe((r: FinancialCard) => {
        response = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/c2b/financial-card');
      expect(response).toEqual(FINANCIAL_CARD);
    });
  });

  describe('getSabadellInfo', () => {
    let response: SabadellInfoResponse;
    it('should call endpoint', () => {
      let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(SABADELL_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getSabadellInfo('1').subscribe((r: SabadellInfoResponse) => {
        response = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/c2b/sabadell/tpv/params', {orderId: '1'});
      expect(response).toEqual(SABADELL_RESPONSE);
    });
  });
});

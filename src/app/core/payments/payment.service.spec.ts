import { fakeAsync, TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { PaymentService } from './payment.service';
import { Observable } from 'rxjs/Observable';
import { BillingInfoResponse, FinancialCard, SabadellInfoResponse, Packs, Perks } from './payment.interface';
import {
  BILLING_INFO_RESPONSE, FINANCIAL_CARD, SABADELL_RESPONSE, PACK_RESPONSE, createPacksFixture, PRODUCTS_RESPONSE_PACKS,
  BUMPS_PRODUCT_RESPONSE, PERK_RESPONSE
} from '../../../tests/payments.fixtures.spec';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { PerksModel } from './payment.model';
import { PRODUCT_RESPONSE } from '../../../tests/item.fixtures.spec';


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
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(FINANCIAL_CARD)});
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
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(SABADELL_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      service.getSabadellInfo('1').subscribe((r: SabadellInfoResponse) => {
        response = r;
      });
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/c2b/sabadell/tpv/params', {orderId: '1'});
      expect(response).toEqual(SABADELL_RESPONSE);
    });
  });

  describe('getPacks', () => {
    let response: Packs;
    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PACK_RESPONSE)});
      const res2: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCTS_RESPONSE_PACKS)});
      spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));
      service.getPacks().subscribe((r: Packs) => {
        response = r;
        console.log(r);
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/packs');
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/products');
    });

    it('should return packs', () => {
      expect(response).toEqual(createPacksFixture());
    });
  });

  describe('getBillingInfo', () => {
    let response: BillingInfoResponse;

    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(BILLING_INFO_RESPONSE)});
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getBillingInfo().subscribe((r: BillingInfoResponse) => {
        response = r;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/payments/billing-info/me');
      expect(response).toEqual(BILLING_INFO_RESPONSE);
    });
  });

  describe('updateBillingInfo', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put');

      service.updateBillingInfo({
        data: 'test'
      });

      expect(http.put).toHaveBeenCalledWith('api/v3/payments/billing-info', {
        data: 'test'
      });
    });
  });

  describe('getSubscriptionPacks', () => {
    let response: Packs;

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PACK_RESPONSE)});
      const res2: ResponseOptions = new ResponseOptions({body: JSON.stringify(BUMPS_PRODUCT_RESPONSE)});
      spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));

      service.getSubscriptionPacks().subscribe((r: Packs) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/subscription/packs');
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/products');
    });

    it('should return packs', () => {
      expect(response).toEqual(createPacksFixture());
    });
  });

  describe('getPerks', () => {
    let response: Perks;
    const returnPerksModel = new PerksModel();

    beforeEach(fakeAsync(() => {
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PERK_RESPONSE)});
      const res2: ResponseOptions = new ResponseOptions({body: JSON.stringify(PRODUCT_RESPONSE)});
      spyOn(http, 'get').and.returnValues(
        Observable.of(new Response(res)),
        Observable.of(new Response(res2)),
        Observable.of(new Response(res)),
        Observable.of(new Response(res2))
      );

      service.getPerks().subscribe((r: Perks) => {
        response = r;
      });
    }));

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/perks/me');
      expect(http.get).toHaveBeenCalledWith('api/v3/payments/products');
    });

    it('should return perks', () => {
      expect(response).toEqual(returnPerksModel);
    });

    it('should not call endpoint the second time', () => {
      http.get['calls'].reset();

      service.getPerks().subscribe((r: Perks) => {
        response = r;
      });

      expect(response).toEqual(returnPerksModel);
      expect(http.get).not.toHaveBeenCalled();
    });

    it('should call endpoint the second time if cache false', () => {
      http.get['calls'].reset();

      service.getPerks(false).subscribe((r: Perks) => {
        response = r;
      });

      expect(response).toEqual(returnPerksModel);
      expect(http.get).toHaveBeenCalled();
    });
  });
});
